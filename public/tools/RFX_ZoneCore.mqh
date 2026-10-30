//+------------------------------------------------------------------+
//| RFX_ZoneCore.mqh  -  RamanFX ZoneVision v2 shared core           |
//| M1: the v1 (1.99) detection / trendline / notes functions, moved |
//|     here unchanged. Series reads in the functions the Direction  |
//|     engine runs on other timeframes go through the accessors     |
//|     SH / SL / SO / SC / ST / SBars / SHighest / SLowest: for a   |
//|     real timeframe they call iHigh / iLow / ... directly (same   |
//|     values as v1), for a virtual one (3M / 6M / 12M) they read   |
//|     the aggregated MN1 series below.                             |
//| M2: top-down Direction engine (Kevin tables, per-TF states,      |
//|     conflict rules, Raja curve, HTF-zone side lock, WOW ladder). |
//| M3: Zone DNA (F01-F29), the four mentor lenses, the consensus    |
//|     verdict and the merge-overlap selection (see the end).       |
//| M5/M6: research-context save / restore of the Direction state,   |
//|     the calibration loader + lookup (RFX_Calib.csv), LensW().    |
//| v2.10 (Raja, A): RjA_* globals (all default = v2.00): close-only |
//|     removal, run-out strong, close-cross arrival, touch rules,   |
//|     trendline touches, near-line / P vs CP / did-its-job notes.  |
//|                                                                  |
//| Host contract (the including .mq5 declares these BEFORE the      |
//| #include line): structs Zone and TLine; the v1 inputs (Inp...);  |
//| macro PFX; the v1 globals (Z, HZ, TL, gTrend, gTF, gUp*, gDn*,   |
//| gH*, pv*, rg*, gN*, gRs, gQuiet, CTF); and the v2 Direction      |
//| inputs (InpDir..., InpCurve..., InpRajaRemoval, InpWOWLines ...).|
//| Functions the core calls that the host defines (anywhere in the  |
//| file): ATR, cT, cH, cL, cBars, Mid, SBid, SAsk, Txt, HLine,      |
//| VisUpTo, Alerted, MarkAlerted, Notify, RegZone.                  |
//+------------------------------------------------------------------+
#ifndef RFX_ZONECORE_MQH
#define RFX_ZONECORE_MQH

#define RFX_CORE_VER 213

// ---- Raja v2.1 (A) ----
// Settings of the Raja v2.1 (A) rules. Plain globals (not inputs) so ZoneBot, which includes this core and never sets
// them, keeps the v1 / v2.00 behaviour; ZoneVision copies its InpRemovalMode / InpRjA* inputs here in OnInit.
// Every default below = the v2.00 behaviour.
int    RjA_RmMode       = 0;      // zone removal: 0 = close or a normal wick beyond the distal (v1), 1 = close only (Raja)
bool   RjA_StrongRun    = false;  // Raja strong = removed an opposite zone anywhere in the run-out (false = within 5 bars of the leg)
bool   RjA_ArrDepart    = false;  // Raja arrival = the run-out crossed a trendline by a close / departure candle (false = v1 full-candle removal)
bool   RjA_TouchTF      = false;  // Raja touch allowance per TF (H1 2nd tap breaks, H4 / MN 3-4, D / W 3rd risky)
bool   RjA_ShowTested   = false;  // draw tested zones still inside that allowance (tagged "needs confirmation")
bool   RjA_Adjacent     = false;  // overlap also = formed right next to a live opposite zone, no gap
bool   RjA_FlipTL       = false;  // flip only after a trendline was crossed before the base
bool   RjA_OppHtfVeto   = false;  // Raja lens: strong zone inside / next to an opposite HTF zone = no trade
bool   RjA_TLTouch      = false;  // count trendline touches (label on the line, Raja lens notes)
bool   RjA_NearLine     = false;  // Raja lens: prefer the zone nearest its trendline, flag zones far from it
double RjA_FarPips      = 25;     // far from the trendline: more than this many pips
bool   RjA_Lens8        = false;  // Raja lens: 3 CPs in a row = skip, P vs CP note, "zone already did its job"
int    RjA_UpT = 0, RjA_DnT = 0;     // touches of the chart's newest respected up / down line (0 = none / not counted)
int    RjA_HUpT = 0, RjA_HDnT = 0;   // the same for the HtfOf(chart) lines (set by the host with the gHUp* copy)
// ---- owner-approved trendline rule (Oct 2026, = supabase/functions/telegram-bot/zvTrend.ts zvLines) ----
// true: the owner's structure method per direction (TwoPivotLines = zvTrend.ts zvLines): the top is never a pivot, the
// line runs from the first lower high after it (pivot 1) along the tangent over the later lower highs, clean anchors
// (FitAnchor), not too flat; KEPT until a candle CLOSES beyond it (then drawn faint up to that candle on its own TF, an
// HTF one is not drawn; TLBias / the break alert read it) and re-anchored from the same pivot 1 at the next lower high.
// HTF lines drawn straight between the chart candles holding the HTF anchors (ChartBarIn, the bot's htfBarIndex).
// false = the v2.12 lines. ZoneVision sets it from InpTLTwoPivot (default true); ZoneBot keeps false (its presets).
bool   ZvTwoPivot       = false;
// the owner trend-line rule's tunable parameters (= zvTrend.ts ZV fitTol / minSlope / minRise; the arrival engine: RX_FIT_TOL ...)
double ZvFitTol = 0.05, ZvMinSlope = 0.015, ZvMinRise = 1.0;
bool   gRsHideOld       = false;  // ZoneVision MT5 InpRealLines: the owner's teaching lines (RFX_STRUCT) replace these lines on the chart TF

//+------------------------------------------------------------------+
//| Virtual timeframes: 3M / 6M / 12M built from MN1 bars            |
//| Calendar-aligned buckets (quarters Jan/Apr/Jul/Oct, halves       |
//| Jan/Jul, years Jan). open = first month's open, high = max,      |
//| low = min, close = last month's close, time = first month. The   |
//| newest bucket is forming (like bar 0). ATR(14) = Wilder's ATR on |
//| the aggregated series. Needs at least 60 MN1 bars.               |
//+------------------------------------------------------------------+
#define TFV_3M   100003
#define TFV_6M   100006
#define TFV_12M  100012
#define VCAP     400
#define VCAP3    1200

int      rvMonths[3] = {3, 6, 12};
int      rvCnt[3]    = {0, 0, 0};
datetime rvT[VCAP3];
double   rvO[VCAP3], rvH[VCAP3], rvL[VCAP3], rvC[VCAP3], rvA[VCAP3];

int  VSlot(ENUM_TIMEFRAMES tf) { int c = (int)tf; return c == TFV_3M ? 0 : (c == TFV_6M ? 1 : (c == TFV_12M ? 2 : -1)); }
bool VIsTF(ENUM_TIMEFRAMES tf) { return VSlot(tf) >= 0; }
int  VIdx(ENUM_TIMEFRAMES tf, int i) { int k = VSlot(tf); if(k < 0 || i < 0 || i >= rvCnt[k]) return -1; return k * VCAP + i; }
void VBuild(int k)
  {
   rvCnt[k] = 0;
   int nb = iBars(_Symbol, PERIOD_MN1);
   if(nb < 60) return;
   MqlRates r[];
   int got = CopyRates(_Symbol, PERIOD_MN1, 0, MathMin(nb, 1500), r);   // oldest first: r[got - 1] = the forming month
   if(got < 60) return;
   int m = rvMonths[k];
   double bo[], bh[], bl[], bc[]; datetime bt[];
   ArrayResize(bo, got); ArrayResize(bh, got); ArrayResize(bl, got); ArrayResize(bc, got); ArrayResize(bt, got);
   int n = 0, lastKey = -1;
   bool partial = false;
   for(int i = 0; i < got; i++)
     {
      MqlDateTime md; ZeroMemory(md);
      TimeToStruct(r[i].time, md);
      int key = md.year * 12 + ((md.mon - 1) / m) * m;                 // bucket = first calendar month of the quarter / half / year
      if(key != lastKey)
        {
         if(n == 0 && (md.mon - 1) % m != 0) partial = true;          // history starts inside a bucket: that first bucket is dropped
         bt[n] = r[i].time; bo[n] = r[i].open; bh[n] = r[i].high; bl[n] = r[i].low; bc[n] = r[i].close;
         n++; lastKey = key;
        }
      else
        {
         bh[n - 1] = MathMax(bh[n - 1], r[i].high);
         bl[n - 1] = MathMin(bl[n - 1], r[i].low);
         bc[n - 1] = r[i].close;
        }
     }
   int first = partial ? 1 : 0;
   if(n - first < 2) return;
   double atr[]; ArrayResize(atr, n); ArrayInitialize(atr, 0);
   double sum = 0; int cntTr = 0;
   for(int i = first; i < n; i++)                                       // Wilder ATR(14), oldest first
     {
      double tr = bh[i] - bl[i];
      if(i > first) tr = MathMax(tr, MathMax(MathAbs(bh[i] - bc[i - 1]), MathAbs(bl[i] - bc[i - 1])));
      cntTr++;
      if(cntTr < 14) { sum += tr; continue; }
      if(cntTr == 14) { sum += tr; atr[i] = sum / 14.0; continue; }
      atr[i] = (atr[i - 1] * 13.0 + tr) / 14.0;
     }
   int use = MathMin(n - first, VCAP);
   for(int j = 0; j < use; j++)                                         // series order: j = 0 is the forming bucket
     {
      int src = n - 1 - j, x = k * VCAP + j;
      rvT[x] = bt[src]; rvO[x] = bo[src]; rvH[x] = bh[src]; rvL[x] = bl[src]; rvC[x] = bc[src]; rvA[x] = atr[src];
     }
   rvCnt[k] = use;
  }
void VBuildAll() { for(int k = 0; k < 3; k++) VBuild(k); }
double VAtr(ENUM_TIMEFRAMES tf, int shift) { int x = VIdx(tf, shift); return x < 0 ? 0 : rvA[x]; }

// series accessors: real timeframe = the MT5 call itself (v1 values), virtual = the cache above
double   SH(string s, ENUM_TIMEFRAMES tf, int i) { if(VSlot(tf) < 0) return iHigh(s, tf, i);  int x = VIdx(tf, i); return x < 0 ? 0 : rvH[x]; }
double   SL(string s, ENUM_TIMEFRAMES tf, int i) { if(VSlot(tf) < 0) return iLow(s, tf, i);   int x = VIdx(tf, i); return x < 0 ? 0 : rvL[x]; }
double   SO(string s, ENUM_TIMEFRAMES tf, int i) { if(VSlot(tf) < 0) return iOpen(s, tf, i);  int x = VIdx(tf, i); return x < 0 ? 0 : rvO[x]; }
double   SC(string s, ENUM_TIMEFRAMES tf, int i) { if(VSlot(tf) < 0) return iClose(s, tf, i); int x = VIdx(tf, i); return x < 0 ? 0 : rvC[x]; }
datetime ST(string s, ENUM_TIMEFRAMES tf, int i) { if(VSlot(tf) < 0) return iTime(s, tf, i);  int x = VIdx(tf, i); return x < 0 ? 0 : rvT[x]; }
int      SBars(string s, ENUM_TIMEFRAMES tf)     { int k = VSlot(tf); if(k < 0) return iBars(s, tf); return rvCnt[k]; }
double   VVal(int x, ENUM_SERIESMODE mode) { return mode == MODE_HIGH ? rvH[x] : (mode == MODE_LOW ? rvL[x] : (mode == MODE_OPEN ? rvO[x] : rvC[x])); }
int SHighest(string s, ENUM_TIMEFRAMES tf, ENUM_SERIESMODE mode, int count, int start)
  {
   if(VSlot(tf) < 0) return iHighest(s, tf, mode, count, start);
   int k = VSlot(tf), best = -1;
   double bv = 0;
   for(int i = MathMax(start, 0); i < start + count && i < rvCnt[k]; i++) { double v = VVal(k * VCAP + i, mode); if(best < 0 || v > bv) { best = i; bv = v; } }
   return best;
  }
int SLowest(string s, ENUM_TIMEFRAMES tf, ENUM_SERIESMODE mode, int count, int start)
  {
   if(VSlot(tf) < 0) return iLowest(s, tf, mode, count, start);
   int k = VSlot(tf), best = -1;
   double bv = 0;
   for(int i = MathMax(start, 0); i < start + count && i < rvCnt[k]; i++) { double v = VVal(k * VCAP + i, mode); if(best < 0 || v < bv) { best = i; bv = v; } }
   return best;
  }

//+------------------------------------------------------------------+
//| v1 functions (ZoneVision 1.99), moved here unchanged (M1).       |
//| Only change: series reads in the marked functions use the        |
//| accessors above, and TfName names the virtual timeframes.        |
//+------------------------------------------------------------------+
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
   if(VIsTF(tf)) return IntegerToString(rvMonths[VSlot(tf)]) + "M";   // v2: virtual 3M / 6M / 12M
   switch(tf) { case PERIOD_M1: return "M1"; case PERIOD_M5: return "M5"; case PERIOD_M15: return "M15"; case PERIOD_M30: return "M30"; case PERIOD_H1: return "H1";
                case PERIOD_H4: return "H4"; case PERIOD_D1: return "D1"; case PERIOD_W1: return "W1"; case PERIOD_MN1: return "MN"; default: break; }
   string e = EnumToString(tf);
   if(StringFind(e, "PERIOD_") == 0) return StringSubstr(e, 7);
   return IntegerToString((int)tf);
  }
double Rng(string s, ENUM_TIMEFRAMES tf, int i)  { return SH(s, tf, i) - SL(s, tf, i); }
double Body(string s, ENUM_TIMEFRAMES tf, int i) { return MathAbs(SC(s, tf, i) - SO(s, tf, i)); }
bool   Basing(string s, ENUM_TIMEFRAMES tf, int i) { double r = Rng(s, tf, i); return r > 0 && Body(s, tf, i) / r < 0.5; }
int    CDir(string s, ENUM_TIMEFRAMES tf, int i) { return SC(s, tf, i) > SO(s, tf, i) ? 1 : (SC(s, tf, i) < SO(s, tf, i) ? -1 : 0); }
bool   Emotional(string s, ENUM_TIMEFRAMES tf, int i) { double a = ATR(tf, i + 1); return a > 0 && Rng(s, tf, i) > InpEmoATR * a; }
// bar index of time t (the bar that holds t); virtual = the newest bucket that starts at or before t (-1 = none)
int SBarShift(string s, ENUM_TIMEFRAMES tf, datetime t)
  {
   int k = VSlot(tf);
   if(k < 0) return iBarShift(s, tf, t, false);
   for(int i = 0; i < rvCnt[k]; i++) if(rvT[k * VCAP + i] <= t) return i;
   return -1;
  }

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
      if(dir > 0 && (SL(s, tf, i) > SL(s, tf, i - j) || SL(s, tf, i) > SL(s, tf, i + j))) return false;
      if(dir < 0 && (SH(s, tf, i) < SH(s, tf, i - j) || SH(s, tf, i) < SH(s, tf, i + j))) return false;
     }
   return true;
  }
// Returns the trap level (0 = none). crowded = an obvious level sits inside the zone itself.
double FindTrap(string s, ENUM_TIMEFRAMES tf, int dir, double prox, double dist, int fromBar, int baseEnd, int &trapBar, bool &crowded)
  {
   trapBar = -1; crowded = false;
   double atr = ATR(tf, 1), best = 0;
   if(atr <= 0) return 0;
   int scan = MathMin(SBars(s, tf) - InpTrapSwing - 2, baseEnd + 40);
   for(int i = scan; i >= InpTrapSwing + 1; i--)
     {
      for(int kind = -1; kind <= 1; kind += 2)                   // swing highs and swing lows
        {
         if(!SwingAt(s, tf, i, kind)) continue;
         double lv = kind > 0 ? SL(s, tf, i) : SH(s, tf, i);
         double lo = MathMin(prox, dist), hi = MathMax(prox, dist);
         if(lv >= lo && lv <= hi && i > baseEnd + InpTrapSwing) { crowded = true; continue; }   // zone built on an older obvious level
         if(i >= fromBar) continue;                                             // trap level forms after the zone
         double gap = dir > 0 ? lv - prox : prox - lv;
         if(gap <= 0 || gap > InpTrapATR * atr) continue;
         // stops still resting: price hasn't traded back through the level since it formed
         bool swept = false;
         for(int j = i - 1; j >= 1; j--) if((dir > 0 && SL(s, tf, j) < lv) || (dir < 0 && SH(s, tf, j) > lv)) { swept = true; break; }
         if(swept) continue;
         if(best == 0 || gap < MathAbs(best - prox)) { best = lv; trapBar = i; }
        }
     }
   return best;
  }

int Detect(string s, ENUM_TIMEFRAMES tf, Zone &out[], bool draw)
  {
   ArrayResize(out, 0);
   int bars = MathMin(InpLookback, SBars(s, tf) - InpMaxBase - 3);
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
         for(int b = L + 1; b <= L + k; b++) { prox = MathMax(prox, MathMax(SO(s, tf, b), SC(s, tf, b))); dist = MathMin(dist, SL(s, tf, b)); }
         dist = MathMin(dist, SL(s, tf, L));
        }
      else
        {
         prox = DBL_MAX; dist = -DBL_MAX;
         for(int b = L + 1; b <= L + k; b++) { prox = MathMin(prox, MathMin(SO(s, tf, b), SC(s, tf, b))); dist = MathMax(dist, SH(s, tf, b)); }
         dist = MathMax(dist, SH(s, tf, L));
        }
      double h = MathAbs(prox - dist);
      double atr = ATR(tf, L);
      if(h <= 0) continue;
      if(atr > 0 && h > InpMaxZoneATR * atr) { Reject(s, tf, L, k, StringFormat("zone %.1f ATR - too big", h / atr), draw); continue; }
      int sa = L - 1;
      if((dir > 0 && SL(s, tf, sa) <= prox) || (dir < 0 && SH(s, tf, sa) >= prox)) { Reject(s, tf, L, k, "no stay-away / no space", draw); continue; }

      Zone z; ZeroMemory(z);
      z.dir = dir; z.prox = prox; z.dist = dist; z.legBar = L; z.baseN = k; z.saBar = sa; z.legRatio = ratio; z.cont = cont;
      z.grade = (ratio >= 2.5 && k <= 3) ? "A" : (ratio >= 1.8 ? "B" : "C");
      z.gap = dir > 0 ? (SL(s, tf, sa) - prox) / h : (prox - SH(s, tf, sa)) / h;
      z.leg2 = sa >= 1 && !Basing(s, tf, sa) && CDir(s, tf, sa) == dir && Rng(s, tf, sa) >= maxBase * InpMinLegRatio;
      z.chain = false; z.arrival = false;
      z.tested = false; z.removed = false; z.removedBar = -1; z.testedBar = -1; z.qual = ""; z.trap = 0; z.trapBar = -1; z.crowded = false;
      bool rjaWick = RjA_RmMode == 0;                                   // Raja v2.1 (A): mode 1 = only a close beyond the distal removes
      for(int j = sa - 1; j >= 1; j--)
        {
         if(dir > 0)
           {
            if(SC(s, tf, j) < dist || (rjaWick && SL(s, tf, j) < dist && !Emotional(s, tf, j))) { z.removed = true; z.removedBar = j; break; }
            if(!z.tested && SL(s, tf, j) <= prox && !Emotional(s, tf, j)) { z.tested = true; z.testedBar = j; }
           }
         else
           {
            if(SC(s, tf, j) > dist || (rjaWick && SH(s, tf, j) > dist && !Emotional(s, tf, j))) { z.removed = true; z.removedBar = j; break; }
            if(!z.tested && SH(s, tf, j) >= prox && !Emotional(s, tf, j)) { z.tested = true; z.testedBar = j; }
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
double Lo(int i) { return SL(_Symbol, gTF, i); }
double Hi(int i) { return SH(_Symbol, gTF, i); }
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
   int a = A; double tol = ZvFitTol * ATR(gTF, 1);                       // Kevin: trendlines never cut a candle (only a hair of slack)
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
// ---- Raja v2.1 (A) ----
// touches of a trendline on gTF (Raja: 1st-3rd touch fine, the 4th usually breaks it, a line tested 3-5 times is weak):
// separate visits from the anchor to the break (or the last closed candle). A visit = candles within 0.1 ATR of the
// line (or through it without a full candle beyond); a new visit needs a candle clear of the line first.
int RjA_LineTouches(TLine &t)
  {
   double sl = (t.pb - t.pa) / MathMax(1, t.a - t.b);
   double tol = 0.1 * ATR(gTF, 1);
   int end = t.removed ? t.removedBar + 1 : 1;
   int n = 0;
   bool inT = false;
   for(int j = t.a; j >= end && j >= 1; j--)
     {
      double lv = LineAt(t.pb, t.b, sl, j);
      bool touch = t.dir > 0 ? Lo(j) <= lv + tol : Hi(j) >= lv - tol;
      if(touch && !inT) n++;
      inT = touch;
     }
   return n;
  }
string RjA_TouchWord(int n)
  {
   if(n <= 0) return "";
   if(n >= 4) return StringFormat("x%d: weak line, likely break", n);
   if(n == 3) return "x3: weak, the 4th touch likely breaks it";
   return StringFormat("x%d", n);
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
         ObjectDelete(0, del); ObjectDelete(0, del + "l"); ObjectDelete(0, del + "k");   // "k": Raja v2.1 (A) touch label
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
// Kevin: a near-horizontal line is not a trendline - and not a momentum line either: flat = NO line. Needs a visible angle
// (Kevin's momentum line is a separate, steep red line: zvMomentum in the arrival engine).
bool TooFlat(int a, int b2, double p2, double sl)
  {
   double atr = MathMax(ATR(gTF, b2), _Point);
   return MathAbs(sl) < 0.015 * atr || MathAbs(p2 - LineAt(p2, b2, sl, a)) < 1.5 * atr;
  }

// owner rule (ZvTwoPivot) = zvTrend.ts zvPair / zvLines (the structure state machine) on gTF through the core accessors.
// ZvPair1: the line pvBar[io] (older) -> pvBar[inw] (newer), FitAnchor re-anchored (clean anchors); false when in the
// wrong order or too flat (ZvMinSlope / ZvMinRise x ATR at the newer pivot)
bool ZvPair1(int io, int inw, int d, int &a, double &sl)
  {
   int b2 = pvBar[inw]; double p2 = pvP[inw];
   if(d > 0 ? !(p2 > pvP[io]) : !(p2 < pvP[io])) return false;
   a = FitAnchor(pvBar[io], b2, p2, d, sl);
   double pa = d > 0 ? Lo(a) : Hi(a);
   if(d > 0 ? !(p2 > pa) : !(p2 < pa)) return false;
   double atr = MathMax(ATR(gTF, b2), _Point);
   return !(MathAbs(sl) < ZvMinSlope * atr || MathAbs(p2 - pa) < ZvMinRise * atr);
  }
bool ZvClose(int d, int b2, double p2, double sl, int j) { double lv = LineAt(p2, b2, sl, j), c = SC(_Symbol, gTF, j); return d > 0 ? c < lv : c > lv; }   // a CLOSE beyond the line
bool ZvAbove(int d, double x, double y) { return d > 0 ? x < y : x > y; }
void ZvAddLine(int d, int a, int b2, double p2, double sl, int brokenAt)
  {
   AddTL(d, a, b2, p2, sl, false);
   int n = ArraySize(TL) - 1;
   TL[n].removedBar = brokenAt; TL[n].removed = brokenAt >= 0;                // owner: broken = a candle CLOSED beyond it
  }
// per direction (down; up mirrored), in bar order: the TOP (highest high wick) is never a pivot; pivot 1 = the first
// lower real peak after it (one at / above it: structure change, the line dies); pivot 2 = the tangent from pivot 1 over
// the lower highs since it (the first valid ZvPair1 in tangent order); the line is KEPT until a candle CLOSES beyond it,
// then the next lower high re-anchors from the same pivot 1. TL gets the live line and the most recent broken one
// (removed: drawn faint up to the breaking candle on this chart's TF; TLBias / the break alert read it).
void TwoPivotLines(int bars)
  {
   for(int d = -1; d <= 1; d += 2)
     {
      int want = d > 0 ? -1 : 1, np = ArraySize(pvBar), k = 0, extBar = -1, p1 = -1, nSeen = 0;
      int seen[];
      ArrayResize(seen, np);
      double extP = 0;
      bool hasLive = false, hasBrk = false;
      int la = 0, lb = 0, lbr = -1, ba = 0, bb = 0, bbr = -1; double lp = 0, lsl = 0, bp = 0, bsl = 0;
      for(int j = bars; j >= 1; j--)
        {
         if(hasLive && j < lb && ZvClose(d, lb, lp, lsl, j)) { hasBrk = true; ba = la; bb = lb; bp = lp; bsl = lsl; bbr = j; hasLive = false; }
         double xj = d > 0 ? Lo(j) : Hi(j);
         if(extBar < 0 || ZvAbove(d, xj, extP))
           {
            if(hasLive) { hasBrk = true; ba = la; bb = lb; bp = lp; bsl = lsl; bbr = j; hasLive = false; }
            extBar = j; extP = xj; p1 = -1; nSeen = 0;
           }
         for(; k < np && pvBar[k] >= j; k++)
           {
            if(pvT[k] != want || !ZvAbove(d, extP, pvP[k])) continue;   // at the top's level (the top itself): never a pivot
            if(p1 < 0 || !ZvAbove(d, pvP[p1], pvP[k]))
              {
               if(hasLive) { hasBrk = true; ba = la; bb = lb; bp = lp; bsl = lsl; bbr = pvBar[k]; hasLive = false; }
               p1 = k; nSeen = 0;
               continue;
              }
            seen[nSeen++] = k;
            if(hasLive) continue;
            int tried[]; ArrayResize(tried, nSeen); ArrayInitialize(tried, 0);
            bool got = false; int a = -1; double sl = 0; int q = -1;
            for(int r = 0; r < nSeen && !got; r++)
              {
               int bi = -1; double bs = 0;
               for(int x = 0; x < nSeen; x++)
                 {
                  if(tried[x] != 0) continue;
                  double s = (pvP[seen[x]] - pvP[p1]) / (pvBar[p1] - pvBar[seen[x]]);
                  if(bi < 0 || (d > 0 ? s < bs : s > bs) || (s == bs && pvBar[seen[x]] < pvBar[seen[bi]])) { bi = x; bs = s; }
                 }
               tried[bi] = 1; q = seen[bi];
               got = ZvPair1(p1, q, d, a, sl);
              }
            if(!got) continue;
            int b2 = pvBar[q], bj = -1; double p2 = pvP[q];
            for(int x = b2 - 1; x >= j; x--) if(ZvClose(d, b2, p2, sl, x)) { bj = x; break; }
            if(bj >= 0) { hasBrk = true; ba = a; bb = b2; bp = p2; bsl = sl; bbr = bj; continue; }
            hasLive = true; la = a; lb = b2; lp = p2; lsl = sl;
           }
        }
      if(hasBrk) ZvAddLine(d, ba, bb, bp, bsl, bbr);
      if(hasLive) ZvAddLine(d, la, lb, lp, lsl, -1);
     }
  }
// a two-pivot line broken by the last closed candle of its TF: one alert (the line itself is no longer drawn)
void ZvBreakAlert(int i)
  {
   if(gQuiet || !InpAlertTL || !TL[i].removed || TL[i].removedBar != 1) return;
   bool up = TL[i].dir > 0;
   string key = "L" + TfName(gTF) + IntegerToString(TL[i].dir) + IntegerToString((long)iTime(_Symbol, gTF, TL[i].a)) + "_" + IntegerToString((long)iTime(_Symbol, gTF, 1));
   if(Alerted(key)) return;
   MarkAlerted(key);
   if(gArmed) Notify(StringFormat("ZoneVision %s %s: %s %s trendline broken - a full candle closed %s it", _Symbol, TfName(CTF), TfName(gTF), up ? "uptrend" : "downtrend", up ? "below" : "above"));
  }

// Kevin's lines: every real valley (peak) gets a line from the previous real one - or, if that is too flat, from the
// original starting point of the current line, else from the lowest (highest) point before it. Each line is drawn until a full candle closes beyond it, then ended there.
// Plus the overall line from the very bottom (top) of the move, when it has a real angle. Near-flat lines are dropped.
void Trendlines(string s, ENUM_TIMEFRAMES tf)
  {
   ArrayResize(TL, 0); gUpOn = false; gDnOn = false;
   RjA_UpT = 0; RjA_DnT = 0;                                          // Raja v2.1 (A): touches of the newest respected lines
   int bars = MathMin(InpLookback, SBars(_Symbol, gTF) - 20);
   ZigZag(bars);
   if(ZvTwoPivot) TwoPivotLines(bars);
   for(int d = -1; d <= 1 && !ZvTwoPivot; d += 2)                     // v2.12 lines (ZvTwoPivot = false)
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
         int A = d > 0 ? SLowest(_Symbol, gTF, MODE_LOW, bars - b2, b2 + 1) : SHighest(_Symbol, gTF, MODE_HIGH, bars - b2, b2 + 1);
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
      int O = d > 0 ? SLowest(_Symbol, gTF, MODE_LOW, bars, 1) : SHighest(_Symbol, gTF, MODE_HIGH, bars, 1);
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
         if(ZvTwoPivot) { if(TL[i].removed) { ZvBreakAlert(i); if(gTF != CTF) continue; } keep = true; }   // owner rule: this TF's broken line is drawn faint up to the breaking candle
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
         if(gTF != CTF && ZvTwoPivot)                                   // owner rule: straight, chart candles holding the HTF anchors
           {
            int ca = ChartBarIn(d, TL[i].a), cb = ChartBarIn(d, TL[i].b);
            if(ca >= 0 && cb >= 0 && ca > cb)
              {
               double csl = (TL[i].pb - TL[i].pa) / (ca - cb);
               x1 = cT(ca); y1 = TL[i].pa; x2 = cT(0) + PeriodSeconds() * 3; pe = TL[i].pb + csl * (cb + 3); rTouch = cT(cb);
              }
           }
         else if(gTF != CTF && InpRefineHTF)
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
         if(InpShowTrendlines && !(gRsHideOld && gTF == CTF)) { ObjectCreate(0, nm, OBJ_TREND, 0, x1, y1, x2, pe); RegTL(nm, x1, tTouch, d, TL[i].removed, gTF == CTF ? 0 : (int)gTF); }
         ObjectSetInteger(0, nm, OBJPROP_RAY_RIGHT, false);
         ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
         ObjectSetInteger(0, nm, OBJPROP_STYLE, TL[i].removed || gTF != CTF ? STYLE_DOT : STYLE_SOLID);   // HTF lines: thin dotted gold
         ObjectSetInteger(0, nm, OBJPROP_WIDTH, 1);                     // all lines thin
         ObjectSetInteger(0, nm, OBJPROP_TIMEFRAMES, VisUpTo(gTF));
         ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
         ObjectSetString(0, nm, OBJPROP_TOOLTIP, TfName(gTF) + (TL[i].conf ? " " : " overall ") + (up ? "uptrend line: real valley, then a higher high" : "downtrend line: real peak, then a lower low")
            + (TL[i].removed ? " | ENDED: a full candle closed " + (up ? "below" : "above") + " it on " + TimeToString(iTime(_Symbol, gTF, end), TIME_DATE | TIME_MINUTES) : " | respected so far"));
         string rjk = (RjA_TLTouch && InpShowTrendlines && !TL[i].removed) ? RjA_TouchWord(RjA_LineTouches(TL[i])) : "";   // Raja v2.1 (A)
         if(rjk != "") ObjectSetString(0, nm, OBJPROP_TOOLTIP, ObjectGetString(0, nm, OBJPROP_TOOLTIP) + " | touches " + rjk);
         if(gTF != CTF && InpShowTrendlines && !TL[i].removed)
           { string ln = nm + "l"; ObjectCreate(0, ln, OBJ_TEXT, 0, x2, pe); ObjectSetString(0, ln, OBJPROP_TEXT, " " + TfName(gTF) + " trendline");
             ObjectSetInteger(0, ln, OBJPROP_COLOR, InpHtfTL); ObjectSetInteger(0, ln, OBJPROP_FONTSIZE, 7); ObjectSetInteger(0, ln, OBJPROP_ANCHOR, ANCHOR_LEFT); ObjectSetInteger(0, ln, OBJPROP_SELECTABLE, false); ObjectSetInteger(0, ln, OBJPROP_TIMEFRAMES, VisUpTo(gTF)); }
         if(rjk != "")                                                  // Raja v2.1 (A): touch count at the line's end
           {
            if(gTF != CTF) ObjectSetString(0, nm + "l", OBJPROP_TEXT, " " + TfName(gTF) + " trendline " + rjk);
            else
              {
               string kn = nm + "k";
               ObjectCreate(0, kn, OBJ_TEXT, 0, x2, pe); ObjectSetString(0, kn, OBJPROP_TEXT, " TL " + rjk);
               ObjectSetInteger(0, kn, OBJPROP_COLOR, cTrend); ObjectSetInteger(0, kn, OBJPROP_FONTSIZE, 7); ObjectSetInteger(0, kn, OBJPROP_ANCHOR, ANCHOR_LEFT);
               ObjectSetInteger(0, kn, OBJPROP_SELECTABLE, false); ObjectSetInteger(0, kn, OBJPROP_TIMEFRAMES, VisUpTo(gTF));
              }
           }
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
         if(RjA_TLTouch) { if(up) RjA_UpT = RjA_LineTouches(TL[i]); else RjA_DnT = RjA_LineTouches(TL[i]); }   // Raja v2.1 (A)
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
   return "no intact trendline";                                       // v2.13: flat / broken = no line (not 'momentum')
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
         double legX = Z[i].dir > 0 ? cH(SHighest(_Symbol, CTF, MODE_HIGH, L - nx + 1, nx)) : cL(SLowest(_Symbol, CTF, MODE_LOW, L - nx + 1, nx));
         if(Z[i].dir > 0 && legX > cH(SHighest(_Symbol, CTF, MODE_HIGH, span, older))) q += "new high | ";
         if(Z[i].dir < 0 && legX < cL(SLowest(_Symbol, CTF, MODE_LOW, span, older))) q += "new low | ";
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
// ---- Raja v2.1 (C) ----
// Stops as a % of the zone height beyond the distal (InpSlMode 1, owner's decision), TP offset before the opposite proximal,
// Kevin overlays switched off for the Raja template (InpRjKevinOff). The host defines RFX_RJC when it has these inputs
// (ZoneVision); without it (ZoneBot) the stubs below give exactly the v1 numbers.
#ifdef RFX_RJC
// per-timeframe stop % of the zone height: M1-M30 / H1-H3 / H4-H12 / D1 / W1, MN and the virtual 3M+
double RjC_SlPct(ENUM_TIMEFRAMES tf)
  {
   if(VIsTF(tf)) return InpSlPctW1;
   int sec = PeriodSeconds(tf);
   if(sec <= 1800) return InpSlPctLTF;
   if(sec <= 3 * 3600) return InpSlPctH1;
   if(sec < 86400) return InpSlPctH4;
   if(sec < 7 * 86400) return InpSlPctD1;
   return InpSlPctW1;
  }
// distance of the stop beyond the distal for a zone of height h on timeframe tf
double RjC_StopBuf(double h, ENUM_TIMEFRAMES tf)
  {
   if(InpSlMode != 1) return InpStopBufferPts * _Point * (MetalOrOil() ? InpMetalOilStop : 1.0);
   return MathMax(RjC_SlPct(tf) / 100.0 * h, InpSlMinPips * MathMax(PipSize(), _Point));
  }
double RjC_TpOff() { return InpTpOffsetPips > 0 ? InpTpOffsetPips * MathMax(PipSize(), _Point) : 0; }
// extra risk for the DNA room (risk = height + spread in v1): the % stop, only in InpSlMode 1
double RjC_RoomBuf(double h, ENUM_TIMEFRAMES tf) { return InpSlMode == 1 ? RjC_StopBuf(h, tf) : 0; }
bool   RjC_KevinOff() { return InpRjKevinOff; }
#else
double RjC_StopBuf(double h, ENUM_TIMEFRAMES tf) { return InpStopBufferPts * _Point * (MetalOrOil() ? InpMetalOilStop : 1.0); }
double RjC_TpOff() { return 0; }
double RjC_RoomBuf(double h, ENUM_TIMEFRAMES tf) { return 0; }
bool   RjC_KevinOff() { return false; }
#endif
bool   RjC_OnlyQual() { return InpOnlyQualified && !RjC_KevinOff(); }                  // Kevin's Sunday rule (off with InpRjKevinOff)
bool   RjC_Overext(int dir, double price) { return !RjC_KevinOff() && Overextended(dir, price); }   // Kevin's channel 50% (off with InpRjKevinOff)
// ---- end Raja v2.1 (C) ----
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
   if(z.gap < InpMinGap && !RjC_KevinOff()) Push(cr, "drawable only: no space under the stay-away candle"); else if(z.gap >= 0.25) Push(pl, StringFormat("clear space %.0f%%", z.gap * 100));
   if(z.tested) Push(cr, "already tested"); else Push(pl, "fresh");
   if(TooSmall(zs, i)) Push(cr, "too small vs other zones");
   if(!z.cont) Push(pl, "VP (Kevin's favourite)");
   if(gTrend == z.dir) Push(pl, "with the HTF trend"); else if(gTrend == -z.dir) Push(cr, "against the HTF trend");
   if(RjC_Overext(z.dir, z.prox)) Push(cr, "beyond channel 50% (overextended)");
   { string nt = NearTrendline(z.dir, z.prox); if(nt != "") Push(pl, "at the " + nt + " trendline"); }
   { int cx = CrossNeeded(z.dir, z.prox); if(cx > 0) Push(pl, "price reaches it without crossing a trendline"); else if(cx < 0) Push(mi, "price must cross a trendline to reach it"); }
   if(z.trap > 0 && !RjC_KevinOff()) Push(pl, "liquidity trap in front");
   if(z.crowded && !RjC_KevinOff()) Push(mi, "on an obvious S/R level (crowded)");
   ENUM_TIMEFRAMES htf = HtfOf(CTF); if(htf <= 0) htf = CTF;
   double xa = MathAbs(Mid() - z.prox) / MathMax(ATR(htf, 1), _Point);
   if(xa > InpMaxDistATR && !RjC_KevinOff()) Push(mi, StringFormat("far: %.1f x %s ATR", xa, TfName(htf)));
   int np = ArraySize(pl), nm = ArraySize(mi), nc = ArraySize(cr);
   verdict = nc > 0 ? "WEAK" : ((np >= 5 && nm <= 1) || z.arrival ? "STRONG" : "OK");
   if(nc > 0) shortWhy = cr[0] + (nc > 1 ? ", " + cr[1] : "");
   else if(verdict == "STRONG") shortWhy = pl[0] + (np > 1 ? ", " + pl[1] : "");
   else shortWhy = (nm > 0 ? mi[0] : (np > 0 ? pl[0] : ""));
   // the plan, the way the drills taught it: entry at the proximal, stop past the distal + buffer (x2 gold / oil),
   // target just before the nearest fresh opposing zone
   double spread = SAsk() - SBid(), buf = RjC_StopBuf(MathAbs(z.prox - z.dist), CTF), opp = 0;   // Raja v2.1 C: v1 buffer unless InpSlMode = 1
   for(int j = 0; j < ArraySize(zs); j++)
     {
      if(zs[j].dir == z.dir || zs[j].removed) continue;
      if(z.dir > 0 && zs[j].prox > z.prox && (opp == 0 || zs[j].prox < opp)) opp = zs[j].prox;
      if(z.dir < 0 && zs[j].prox < z.prox && (opp == 0 || zs[j].prox > opp)) opp = zs[j].prox;
     }
   double en = z.dir > 0 ? z.prox + spread : z.prox, sl = z.dir > 0 ? z.dist - buf : z.dist + buf + spread;
   double tpo = RjC_TpOff();                                          // Raja v2.1 C: TP offset before the opposite proximal (0 = v1)
   double tp = opp > 0 ? (z.dir > 0 ? opp - spread - tpo : opp + spread + tpo) : 0;
   if(tpo > 0 && tp > 0 && z.dir * (tp - en) <= 0) tp = 0;
   double rr = tp > 0 ? MathAbs(tp - en) / MathMax(MathAbs(en - sl), _Point) : 0;
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
   if(RjC_Overext(z.dir, z.prox)) ls += "overextended = wait (drill 9); ";
   ls += "TP before the next zone, not past it (drills 2, 6, 7)";
   t += "Drills: " + ls;
   if(StringLen(t) > 900) t = StringSubstr(t, 0, 895) + "...";        // keep the details text to tooltip size
   return t;
  }

// ---- Raja v2.1 (A) ----
// Raja touch allowance (RjA_TouchTF / RjA_ShowTested). TF class: 3 = MN and up, 2 = D1 / W1, 1 = H4 (H6-H12 too), 0 = H1 and below
int RjA_TfClass(ENUM_TIMEFRAMES tf) { if(VIsTF(tf) || tf >= PERIOD_MN1) return 3; if(tf >= PERIOD_D1) return 2; if(tf >= PERIOD_H4) return 1; return 0; }
// earlier touches a tested zone may have and still be traded with confirmation: H1 and below 1 (the 2nd tap often breaks it),
// H4 / D1 / W1 / MN 2 (H4 and MN hold 3-4 taps, the 4th usually breaks; on D1 / W1 the 3rd touch is already risky)
int RjA_TouchCap(ENUM_TIMEFRAMES tf) { return RjA_TfClass(tf) == 0 ? 1 : 2; }
// touches after the stay-away, counted like DnaTests (F16): a new touch needs a candle fully outside the proximal first,
// emotional candles do not count; stops at the removal
int RjA_TouchN(ENUM_TIMEFRAMES tf, Zone &z)
  {
   int n = 0;
   bool away = true, inT = false;
   int stop = z.removed ? z.removedBar : 0;
   for(int j = z.saBar - 1; j >= 1 && j > stop; j--)
     {
      double adv = z.dir > 0 ? SL(_Symbol, tf, j) : SH(_Symbol, tf, j);
      bool touch = z.dir > 0 ? adv <= z.prox : adv >= z.prox;
      if(touch && Emotional(_Symbol, tf, j)) continue;
      if(touch) { if(!inT && away) { n++; inT = true; away = false; } }
      else { away = true; inT = false; }
     }
   return n;
  }
// v1 rule "tested zones hidden unless InpShowTested", plus: with RjA_ShowTested a tested zone inside Raja's allowance stays
bool RjA_HideTested(ENUM_TIMEFRAMES tf, Zone &z)
  {
   if(InpShowTested) return false;
   if(!RjA_ShowTested || z.removed) return true;
   int n = RjA_TouchN(tf, z);
   return n < 1 || n > RjA_TouchCap(tf);
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
      if(zs[i].tested && !htf && RjA_HideTested(tf, zs[i])) continue;   // = !InpShowTested unless RjA_ShowTested (Raja v2.1 A)
      if(!htf && RjC_OnlyQual() && !zs[i].chain && !zs[i].removed) continue;
      if(!htf && TooSmall(zs, i)) continue;
      if(!htf && V2Hide(zs[i])) continue;                            // v2 location filters (InpLockSide / InpCurveFilter, both off by default)
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
      if(!htf && z.trap > 0 && z.trapBar > 0 && !RjC_KevinOff())
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

//+------------------------------------------------------------------+
//| HTF trend (same fractal method as ZoneBot) + curve               |
//| Fractals computed here with the MT4 Fractals rule (2 bars each   |
//| side, equal highs / lows allowed up to 9-bar patterns) - no       |
//| indicator handle needed.                                         |
//+------------------------------------------------------------------+
double FracUp(string s, ENUM_TIMEFRAMES tf, int i)
  {
   int bars = SBars(s, tf);
   if(i < 2 || i + 2 > bars - 1) return 0;
   double c = SH(s, tf, i);
   if(!(c > SH(s, tf, i - 1) && c > SH(s, tf, i - 2))) return 0;
   double p1 = SH(s, tf, i + 1), p2 = SH(s, tf, i + 2);
   if(c > p1 && c > p2) return c;
   if(bars - i - 1 >= 3) { double p3 = SH(s, tf, i + 3); if(c == p1 && c > p2 && c > p3) return c; }
   if(bars - i - 1 >= 4) { double p3 = SH(s, tf, i + 3), p4 = SH(s, tf, i + 4); if(c >= p1 && c == p2 && c > p3 && c > p4) return c; }
   if(bars - i - 1 >= 5) { double p3 = SH(s, tf, i + 3), p4 = SH(s, tf, i + 4), p5 = SH(s, tf, i + 5); if(c >= p1 && c == p2 && c == p3 && c > p4 && c > p5) return c; }
   if(bars - i - 1 >= 6) { double p3 = SH(s, tf, i + 3), p4 = SH(s, tf, i + 4), p5 = SH(s, tf, i + 5), p6 = SH(s, tf, i + 6); if(c >= p1 && c == p2 && c >= p3 && c == p4 && c > p5 && c > p6) return c; }
   return 0;
  }
double FracDn(string s, ENUM_TIMEFRAMES tf, int i)
  {
   int bars = SBars(s, tf);
   if(i < 2 || i + 2 > bars - 1) return 0;
   double c = SL(s, tf, i);
   if(!(c < SL(s, tf, i - 1) && c < SL(s, tf, i - 2))) return 0;
   double p1 = SL(s, tf, i + 1), p2 = SL(s, tf, i + 2);
   if(c < p1 && c < p2) return c;
   if(bars - i - 1 >= 3) { double p3 = SL(s, tf, i + 3); if(c == p1 && c < p2 && c < p3) return c; }
   if(bars - i - 1 >= 4) { double p3 = SL(s, tf, i + 3), p4 = SL(s, tf, i + 4); if(c <= p1 && c == p2 && c < p3 && c < p4) return c; }
   if(bars - i - 1 >= 5) { double p3 = SL(s, tf, i + 3), p4 = SL(s, tf, i + 4), p5 = SL(s, tf, i + 5); if(c <= p1 && c == p2 && c == p3 && c < p4 && c < p5) return c; }
   if(bars - i - 1 >= 6) { double p3 = SL(s, tf, i + 3), p4 = SL(s, tf, i + 4), p5 = SL(s, tf, i + 5), p6 = SL(s, tf, i + 6); if(c <= p1 && c == p2 && c <= p3 && c == p4 && c < p5 && c < p6) return c; }
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
   double c = SC(s, htf, 1);
   if(c > hi[0]) return 1;
   if(c < lo[0]) return -1;
   return 0;
  }
double Curve(string s, ENUM_TIMEFRAMES htf, double p)
  {
   int hiI = SHighest(s, htf, MODE_HIGH, 100, 1), loI = SLowest(s, htf, MODE_LOW, 100, 1);
   if(hiI < 0 || loI < 0) return 50;
   double hi = SH(s, htf, hiI), lo = SL(s, htf, loI);
   return hi > lo ? 100.0 * (p - lo) / (hi - lo) : 50;
  }

//+------------------------------------------------------------------+
//| v2 Direction engine (spec section 2)                             |
//| For every TF of the stack: the existing Trendlines, Detect and   |
//| HtfTrend run quietly (nothing drawn), then 5 inputs are derived: |
//|  S swings (HtfTrend), T newest trendline cross (TLBias rule, or  |
//|  a departure close with InpDirDepartATR > 0), R opposite zones   |
//|  removed since that cross, L price inside a fresh zone, C CP run.|
//| One state per TF, then the conflict rules give one Direction.    |
//| Display only: gTrend (v1 bias) changes only with InpBiasSource=1.|
//+------------------------------------------------------------------+
#define DST_NA     0
#define DST_TREND  1
#define DST_TURN   2
#define DST_CHG    3
#define DST_PULL   4
#define DST_RANGE  5
#define DMAXROW    8

struct DirRow
  {
   ENUM_TIMEFRAMES tf;
   string   role;        // ETF / ITF / HTF / +1 / MAC
   string   note;        // e.g. "3M n/a: MN used"
   bool     ok;          // enough bars
   int      S, T, rm;    // swings, trendline cross side, opposite zones removed since the cross
   int      st, side;    // DST_* state and its side (+1 / -1 / 0)
   int      cp, cpDir;   // CP run (consecutive same-side CP zones, newest first) and its side
   int      inZ;         // price inside a fresh zone of this TF: +1 demand, -1 supply, 0 none
   int      tBar;        // bar of the T cross (-1 none)
   bool     upOn, dnOn;  // newest up / down line still respected
   bool     swingOnly;   // UP / DOWN from the swings alone (no line crossed in the window)
   datetime tTime;
   double   inLo, inHi;
  };
DirRow   drRow[DMAXROW];
int      drN = 0;
int      drE = -1, drI = -1, drH = -1, drP = -1;   // row index of ETF, ITF, HTF, Higher+1
Zone     drZ[];  int drZRow[];                     // zones of every stack TF (engine only, never drawn)
TLine    drTL[]; int drTLRow[]; int drTLX[];       // lines of every stack TF and their cross bar
// outputs
bool     gDirOk = false;
int      gDir = 0;          // -1 / 0 / +1 (0 while waiting)
int      gDirQ = 0;         // 0 wait, 1 reduced, 2 full (per side; -1 = blocked is reported through gDirBlocked)
int      gDirSide = 0;      // side found by the rules, also while waiting
int      gDirBlocked = 0;   // side blocked by Raja's curve (0 none)
bool     gDirRealign = false;
string   gDirHead = "";
string   gDirTxt[4];
int      gTFState[5];       // ETF, ITF, HTF, +1, first macro row: state x side (UP +1, TURNING +-2, CHANGED +-3, PULLBACK +-4, RANGE 5, n/a 0)
// location
bool     gCurveOk = false, gCurveRaja = false;
double   gCurve = 50, gCurvePd = 0, gCurvePs = 0;
double   gRangeLo = 0, gRangeHi = 0;               // nearest fresh HTF demand (proximal) below / supply above
int      gLockSide = 0;
double   gLockLo = 0, gLockHi = 0;
ENUM_TIMEFRAMES gLockTF = PERIOD_CURRENT;
// WOW ladder
double   gWow1 = 0, gWow2 = 0;
bool     gWowPend = false;  // WOW1 waits for an opposite zone to be removed (guard)
string   gWowTxt[4];
int      gWowN = 0;
double   gWowPx[4];
// saved chart context while the engine borrows the trendline globals
ENUM_TIMEFRAMES drSvGTF = PERIOD_CURRENT;
bool     drSvUpOn = false, drSvDnOn = false, drSvQuiet = false;
double   drSvUpS = 0, drSvUpP = 0, drSvUpW = 0, drSvDnS = 0, drSvDnP = 0, drSvDnW = 0;
int      drSvUpB = 0, drSvDnB = 0;
TLine    drSvTL[];
int      drSvRjUpT = 0, drSvRjDnT = 0;                   // Raja v2.1 (A) line touches

void DirSave()
  {
   drSvGTF = gTF; drSvQuiet = gQuiet;
   drSvUpOn = gUpOn; drSvDnOn = gDnOn; drSvUpS = gUpS; drSvUpP = gUpP; drSvUpW = gUpW; drSvDnS = gDnS; drSvDnP = gDnP; drSvDnW = gDnW; drSvUpB = gUpB; drSvDnB = gDnB;
   int n = ArraySize(TL); ArrayResize(drSvTL, n); for(int i = 0; i < n; i++) drSvTL[i] = TL[i];
   drSvRjUpT = RjA_UpT; drSvRjDnT = RjA_DnT;                          // Raja v2.1 (A)
  }
void DirRestore()
  {
   gTF = drSvGTF; gQuiet = drSvQuiet;
   gUpOn = drSvUpOn; gDnOn = drSvDnOn; gUpS = drSvUpS; gUpP = drSvUpP; gUpW = drSvUpW; gDnS = drSvDnS; gDnP = drSvDnP; gDnW = drSvDnW; gUpB = drSvUpB; gDnB = drSvDnB;
   int n = ArraySize(drSvTL); ArrayResize(TL, n); for(int i = 0; i < n; i++) TL[i] = drSvTL[i];
   RjA_UpT = drSvRjUpT; RjA_DnT = drSvRjDnT;                          // Raja v2.1 (A)
  }

//--- timeframe tables (spec 2.1)
// the standard TF whose table row a chart TF uses (MT5-only TFs: the standard TF below it, as v1 StepUp)
ENUM_TIMEFRAMES DirStd(ENUM_TIMEFRAMES tf)
  {
   ENUM_TIMEFRAMES lad[8] = {PERIOD_M1, PERIOD_M5, PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1, PERIOD_MN1};
   for(int k = 0; k < 8; k++) if(lad[k] == tf) return tf;
   if(tf == PERIOD_M30) return PERIOD_M15;
   if(InpExtraTF) for(int k = 7; k >= 0; k--) if(lad[k] < tf) return lad[k];
   return PERIOD_CURRENT;
  }
// one step up the long ladder M1 M5 M15 H1 H4 D1 W1 MN 3M 6M 12M (PERIOD_CURRENT = none)
ENUM_TIMEFRAMES DirUp(ENUM_TIMEFRAMES tf)
  {
   ENUM_TIMEFRAMES lad[11];
   lad[0] = PERIOD_M1; lad[1] = PERIOD_M5; lad[2] = PERIOD_M15; lad[3] = PERIOD_H1; lad[4] = PERIOD_H4; lad[5] = PERIOD_D1;
   lad[6] = PERIOD_W1; lad[7] = PERIOD_MN1; lad[8] = (ENUM_TIMEFRAMES)TFV_3M; lad[9] = (ENUM_TIMEFRAMES)TFV_6M; lad[10] = (ENUM_TIMEFRAMES)TFV_12M;
   for(int k = 0; k < 10; k++) if(lad[k] == tf) return lad[k + 1];
   return PERIOD_CURRENT;
  }
// Kevin lesson 15 slide, third column (Higher+1)
ENUM_TIMEFRAMES DirL15Top(ENUM_TIMEFRAMES b)
  {
   switch(b)
     {
      case PERIOD_M1:  return PERIOD_H4;
      case PERIOD_M5:  return PERIOD_D1;
      case PERIOD_M15: return PERIOD_W1;
      case PERIOD_H1:  return PERIOD_MN1;
      case PERIOD_H4:  return (ENUM_TIMEFRAMES)TFV_3M;
      case PERIOD_D1:  return (ENUM_TIMEFRAMES)TFV_6M;
      case PERIOD_W1:  return (ENUM_TIMEFRAMES)TFV_12M;
      default: break;
     }
   return PERIOD_CURRENT;
  }
// ITF / HTF / Higher+1 of a chart TF for InpDirTable 0 (v1), 1 (Kevin lesson 4), 2 (Kevin lesson 15) or 3 (Raja, v2.1 B)
bool DirTable(ENUM_TIMEFRAMES ctf, ENUM_TIMEFRAMES &itf, ENUM_TIMEFRAMES &htf, ENUM_TIMEFRAMES &p1)
  {
   itf = PERIOD_CURRENT; htf = PERIOD_CURRENT; p1 = PERIOD_CURRENT;
   ENUM_TIMEFRAMES b = DirStd(ctf);
   if(b == PERIOD_CURRENT) return false;
   if(InpDirTable == 2)
     {
      itf = DirUp(DirUp(b));
      switch(b)
        {
         case PERIOD_M1:  itf = PERIOD_M15; break;
         case PERIOD_M5:  itf = PERIOD_H1;  break;
         case PERIOD_M15: itf = PERIOD_H4;  break;
         case PERIOD_H1:  itf = PERIOD_D1;  break;
         case PERIOD_H4:  itf = PERIOD_W1;  break;
         case PERIOD_D1:  itf = PERIOD_MN1; break;
         default: break;
        }
      htf = DirL15Top(b);
      if(htf == PERIOD_CURRENT) htf = DirUp(itf);
      p1 = DirUp(htf);
     }
   else if(InpDirTable == 0)
     {
      itf = StepUp(ctf, 1);
      htf = HtfOf(ctf);
      if(htf <= 0) htf = StepUp(ctf, 2);
      if(itf <= 0 || itf >= htf) itf = DirUp(b);
      p1 = DirL15Top(b);
      if(p1 == PERIOD_CURRENT || p1 <= htf) p1 = DirUp(htf);
     }
   else if(InpDirTable == 3)
     {
      // ---- Raja v2.1 (B) ---- Raja table (L8, low-TF class): direction only from D1 / W1 / MN
      // H1 -> H4 -> D1 -> W1, H4 -> D1 -> W1 -> MN, D1 -> W1 -> MN, LTF (M1-M30) -> H1 / H4 -> D1 -> W1
      ENUM_TIMEFRAMES rjbLit = InpRjBLtfItf == 1 ? PERIOD_H4 : PERIOD_H1;
      switch(b)
        {
         case PERIOD_M1:  itf = PERIOD_H1;  htf = PERIOD_D1;  p1 = PERIOD_W1;  break;
         case PERIOD_M5:  itf = PERIOD_H1;  htf = PERIOD_D1;  p1 = PERIOD_W1;  break;
         case PERIOD_M15: itf = rjbLit;     htf = PERIOD_D1;  p1 = PERIOD_W1;  break;   // M30 maps to the M15 row (DirStd)
         case PERIOD_H1:  itf = PERIOD_H4;  htf = PERIOD_D1;  p1 = PERIOD_W1;  break;
         case PERIOD_H4:  itf = PERIOD_D1;  htf = PERIOD_W1;  p1 = PERIOD_MN1; break;
         case PERIOD_D1:  itf = PERIOD_W1;  htf = PERIOD_MN1; break;                    // no Higher+1 row
         case PERIOD_W1:  itf = PERIOD_MN1; htf = (ENUM_TIMEFRAMES)TFV_3M; break;      // beyond the table: next steps up
         case PERIOD_MN1: itf = (ENUM_TIMEFRAMES)TFV_3M; htf = (ENUM_TIMEFRAMES)TFV_6M; break;
         default: break;
        }
     }
   else
     {
      switch(b)                                                        // Kevin lesson 4 table: ETF -> ITF -> HTF
        {
         case PERIOD_M1:  itf = PERIOD_M5;  htf = PERIOD_M15; break;
         case PERIOD_M5:  itf = PERIOD_M15; htf = PERIOD_H1;  break;
         case PERIOD_M15: itf = PERIOD_H1;  htf = PERIOD_H4;  break;
         case PERIOD_H1:  itf = PERIOD_H4;  htf = PERIOD_D1;  break;
         case PERIOD_H4:  itf = PERIOD_D1;  htf = PERIOD_W1;  break;
         case PERIOD_D1:  itf = PERIOD_MN1; htf = (ENUM_TIMEFRAMES)TFV_3M; break;
         case PERIOD_W1:  itf = PERIOD_MN1; htf = (ENUM_TIMEFRAMES)TFV_3M; break;   // beyond the table: next steps up
         case PERIOD_MN1: itf = (ENUM_TIMEFRAMES)TFV_3M; htf = (ENUM_TIMEFRAMES)TFV_6M; break;
         default: break;
        }
      p1 = DirL15Top(b);
      if(p1 == PERIOD_CURRENT || p1 <= htf) p1 = DirUp(htf);
     }
   return htf != PERIOD_CURRENT;
  }
// every real TF the stack can use (for the host's ATR slots); returns the count
int DirStackTFs(ENUM_TIMEFRAMES &out[])
  {
   ArrayResize(out, 0);
   ENUM_TIMEFRAMES itf = PERIOD_CURRENT, htf = PERIOD_CURRENT, p1 = PERIOD_CURRENT;
   if(!DirTable(CTF, itf, htf, p1)) return 0;
   ENUM_TIMEFRAMES c[5]; c[0] = itf; c[1] = htf; c[2] = InpDirPlus1 ? p1 : PERIOD_CURRENT; c[3] = PERIOD_CURRENT; c[4] = PERIOD_CURRENT;
   if(VIsTF(itf) || VIsTF(htf) || VIsTF(c[2]) || InpDirMacro) c[3] = PERIOD_MN1;   // virtual TFs are built from MN1
   int n = 0;
   for(int k = 0; k < 5; k++) { if(c[k] == PERIOD_CURRENT || VIsTF(c[k])) continue; ArrayResize(out, n + 1); out[n] = c[k]; n++; }   // real TFs only (ATR handles)
   return n;
  }

//--- per-TF helpers
string DirTfName(ENUM_TIMEFRAMES tf) { return tf == PERIOD_CURRENT ? "-" : TfName(tf); }
string DirSg(int v) { return v > 0 ? "+" + IntegerToString(v) : IntegerToString(v); }
string DirSideWord(int d) { return d > 0 ? "UP" : (d < 0 ? "DOWN" : ""); }
string DirStateName(int st, int side)
  {
   switch(st)
     {
      case DST_TREND: return DirSideWord(side);
      case DST_TURN:  return "TURNING " + DirSideWord(side);
      case DST_CHG:   return "CHANGED " + DirSideWord(side);
      case DST_PULL:  return "PULLBACK";
      case DST_RANGE: return "RANGE";
      default: break;
     }
   return "n/a";
  }
int DirStateCode(int r)
  {
   if(r < 0 || r >= drN || !drRow[r].ok) return 0;
   if(drRow[r].st == DST_RANGE) return 5;
   return drRow[r].st * (drRow[r].side >= 0 ? 1 : -1);
  }
// moving side of a row for the conflict rules: UP / TURNING / CHANGED / PULLBACK count, RANGE and n/a do not
int DirRowSide(int r) { if(r < 0 || r >= drN || !drRow[r].ok || drRow[r].st == DST_RANGE || drRow[r].st == DST_NA) return 0; return drRow[r].side; }
// HTF side for rule 3: UP, CHANGED UP or TURNING UP (mirrored); a PULLBACK does not set the side
int DirTrendSide(int r) { if(r < 0 || r >= drN || !drRow[r].ok) return 0; int st = drRow[r].st; return (st == DST_TREND || st == DST_CHG || st == DST_TURN) ? drRow[r].side : 0; }

// cross bar of a line: v1 rule (a full candle beyond it) or, with InpDirDepartATR > 0, Raja's departure close
// (closes beyond the line, candle in the break direction, body >= InpDirDepartATR x ATR). -1 = not crossed.
int DirCrossBar(ENUM_TIMEFRAMES tf, TLine &t)
  {
   if(InpDirDepartATR <= 0) return t.removed ? t.removedBar : -1;
   double slp = (t.pb - t.pa) / MathMax(1, t.a - t.b);
   for(int j = t.b - 1; j >= 1; j--)
     {
      double lv = LineAt(t.pb, t.b, slp, j), a = ATR(tf, j), c = SC(_Symbol, tf, j);
      bool beyond = t.dir > 0 ? c < lv : c > lv;
      if(beyond && CDir(_Symbol, tf, j) == -t.dir && a > 0 && Body(_Symbol, tf, j) >= InpDirDepartATR * a) return j;
     }
   return -1;
  }
// Raja removal (RJ-B): a close beyond the distal AND the next candle also closing beyond it with a big body. Bar of the 2nd close, -1 = still live.
int DirRajaRemoved(ENUM_TIMEFRAMES tf, Zone &z)
  {
   for(int j = z.saBar - 1; j >= 2; j--)
     {
      bool c1 = z.dir > 0 ? SC(_Symbol, tf, j) < z.dist : SC(_Symbol, tf, j) > z.dist;
      if(!c1) continue;
      int k = j - 1;
      bool c2 = z.dir > 0 ? SC(_Symbol, tf, k) < z.dist : SC(_Symbol, tf, k) > z.dist;
      double a = ATR(tf, k);
      if(c2 && a > 0 && Body(_Symbol, tf, k) >= InpRajaBigBody * a) return k;
     }
   return -1;
  }
// fresh at entry: not removed, and untested or touched only by the visit that is still going on
bool DirFreshAt(ENUM_TIMEFRAMES tf, Zone &z)
  {
   if(z.removed) return false;
   if(!z.tested) return true;
   double lo = MathMin(z.prox, z.dist), hi = MathMax(z.prox, z.dist);
   for(int j = z.testedBar; j >= 1; j--) if(SL(_Symbol, tf, j) > hi || SH(_Symbol, tf, j) < lo) return false;
   return true;
  }
// ---- Raja v2.1 (A) ----
// last bar of a zone's run-out: the bar of the first return to the proximal, else of the removal, else the last closed candle
int RjA_RunEnd(Zone &z) { return z.tested ? z.testedBar : (z.removed ? z.removedBar : 1); }
// Raja strong (type 1): the zone's move removed an opposite zone (the v1 Qualify window: removed within 5 bars of the leg)
bool DirRajaStrong(int r, int i)
  {
   int lo = drZ[i].legBar - 5;
   if(RjA_StrongRun) lo = MathMin(lo, RjA_RunEnd(drZ[i]));           // Raja v2.1 (A): anywhere in the run-out
   for(int j = 0; j < ArraySize(drZ); j++)
     {
      if(drZRow[j] != r || drZ[j].dir != -drZ[i].dir || !drZ[j].removed) continue;
      if(drZ[j].legBar > drZ[i].legBar && drZ[j].removedBar <= drZ[i].legBar && drZ[j].removedBar >= lo) return true;
     }
   return false;
  }

// one stack row: S, T, R, L, C and the state (spec 2.2)
void DirEvalTF(int r)
  {
   ENUM_TIMEFRAMES tf = drRow[r].tf;
   drRow[r].ok = false; drRow[r].S = 0; drRow[r].T = 0; drRow[r].rm = 0; drRow[r].st = DST_NA; drRow[r].side = 0;
   drRow[r].cp = 0; drRow[r].cpDir = 0; drRow[r].inZ = 0; drRow[r].tBar = -1; drRow[r].tTime = 0;
   drRow[r].inLo = 0; drRow[r].inHi = 0; drRow[r].upOn = false; drRow[r].dnOn = false; drRow[r].swingOnly = false;
   if(tf == PERIOD_CURRENT) return;
   if(SBars(_Symbol, tf) < 40) return;                                // not enough bars: n/a
   if(ATR(tf, 1) <= 0) return;                                        // ATR not ready yet: n/a this redraw
   drRow[r].ok = true;
   drRow[r].S = HtfTrend(_Symbol, tf);
   gTF = tf;
   Trendlines(_Symbol, tf);                                           // quiet: gQuiet is set by DirRun, nothing is drawn
   drRow[r].upOn = gUpOn; drRow[r].dnOn = gDnOn;
   int tb = -1, td = 0;
   for(int i = 0; i < ArraySize(TL); i++)
     {
      int cb = DirCrossBar(tf, TL[i]);
      int n = ArraySize(drTL);
      ArrayResize(drTL, n + 1); ArrayResize(drTLRow, n + 1); ArrayResize(drTLX, n + 1);
      drTL[n] = TL[i]; drTLRow[n] = r; drTLX[n] = cb;
      if(cb < 0) continue;
      if(tb < 0 || cb < tb) { tb = cb; td = -TL[i].dir; }             // the newest cross decides: a broken down line = +1
     }
   drRow[r].T = td; drRow[r].tBar = tb; drRow[r].tTime = tb >= 0 ? ST(_Symbol, tf, tb) : 0;
   Zone zz[];
   Detect(_Symbol, tf, zz, false);
   int nz = ArraySize(zz);
   int z0 = ArraySize(drZ);
   ArrayResize(drZ, z0 + nz); ArrayResize(drZRow, z0 + nz);
   for(int i = 0; i < nz; i++) { drZ[z0 + i] = zz[i]; drZRow[z0 + i] = r; }
   // R: opposite zones removed since the newest cross (v1 removal, or Raja removal)
   int rm = 0;
   if(td != 0)
      for(int i = 0; i < nz; i++)
        {
         if(zz[i].dir != -td || !zz[i].removed) continue;
         int rb = InpRajaRemoval ? DirRajaRemoved(tf, zz[i]) : zz[i].removedBar;
         if(rb >= 1 && rb <= tb) rm++;
        }
   drRow[r].rm = rm;
   // C: CP run, newest zone first (Detect lists oldest first)
   if(nz > 0)
     {
      int cd = zz[nz - 1].dir, cp = 0;
      for(int k = nz - 1; k >= 0; k--) { if(zz[k].dir != cd || !zz[k].cont) break; cp++; }
      drRow[r].cp = cp; drRow[r].cpDir = cd;
     }
   // L: price inside a fresh zone of this TF (the newest one wins)
   double mid = Mid();
   for(int i = nz - 1; i >= 0; i--)
     {
      double lo = MathMin(zz[i].prox, zz[i].dist), hi = MathMax(zz[i].prox, zz[i].dist);
      if(mid < lo || mid > hi || !DirFreshAt(tf, zz[i])) continue;
      drRow[r].inZ = zz[i].dir; drRow[r].inLo = lo; drRow[r].inHi = hi;
      break;
     }
   // state (spec 2.2), evaluated in this order
   int S = drRow[r].S, T = td, N = MathMax(1, InpDirRemovedN);
   bool est = T > 0 ? gUpOn : (T < 0 ? gDnOn : false);              // a line in the new direction already formed and is respected
   bool mixed = gUpOn && gDnOn;
   if(T == 0)
     {
      if(S == 0 || mixed) { drRow[r].st = DST_RANGE; drRow[r].side = 0; }
      else { drRow[r].st = DST_TREND; drRow[r].side = S; drRow[r].swingOnly = true; }
     }
   else if(S == -T) { drRow[r].st = rm >= N ? DST_CHG : DST_PULL; drRow[r].side = T; }
   else if(est) { drRow[r].st = DST_TREND; drRow[r].side = T; }
   else { drRow[r].st = rm >= N ? DST_CHG : DST_TURN; drRow[r].side = T; }
  }

// curve (F18) and range edges from the HTF row's zones
void DirCurve()
  {
   gCurveOk = false; gCurveRaja = false; gCurve = 50; gCurvePd = 0; gCurvePs = 0; gRangeLo = 0; gRangeHi = 0;
   if(drH < 0 || !drRow[drH].ok) return;
   ENUM_TIMEFRAMES tf = drRow[drH].tf;
   double mid = Mid(), pd = 0, ps = 0;
   for(int i = 0; i < ArraySize(drZ); i++)
     {
      if(drZRow[i] != drH || !DirFreshAt(tf, drZ[i])) continue;
      bool dn = drZ[i].dir > 0;
      if(dn && drZ[i].dist < mid && (gRangeLo == 0 || drZ[i].prox > gRangeLo)) gRangeLo = drZ[i].prox;
      if(!dn && drZ[i].dist > mid && (gRangeHi == 0 || drZ[i].prox < gRangeHi)) gRangeHi = drZ[i].prox;
      if(!DirRajaStrong(drH, i)) continue;
      if(dn && drZ[i].dist < mid && (pd == 0 || drZ[i].prox > pd)) pd = drZ[i].prox;
      if(!dn && drZ[i].dist > mid && (ps == 0 || drZ[i].prox < ps)) ps = drZ[i].prox;
     }
   if(InpCurveMode == 1 && pd > 0 && ps > pd) { gCurveRaja = true; gCurvePd = pd; gCurvePs = ps; gCurve = 100.0 * (mid - pd) / (ps - pd); }
   else gCurve = Curve(_Symbol, tf, mid);                            // v1 curve: position in the 100-bar HTF range
   gCurveOk = true;
  }
// curve value of any price (same mode as the readout)
double DirCurveAt(double p)
  {
   if(!gCurveOk) return 50;
   if(gCurveRaja) return 100.0 * (p - gCurvePd) / (gCurvePs - gCurvePd);
   return Curve(_Symbol, drRow[drH].tf, p);
  }
string DirCurveWord(double c) { return c >= InpCurveHigh ? "high curve: sells only" : (c <= InpCurveLow ? "low curve: buys only" : (c >= 45 && c <= 55 ? "50% line" : "middle: confirmation only")); }

// v2 merge overlap (spec 5.4, InpMergeOverlap, default off): chart zones merged away (legBar + dir), and the zone kept for each
int      gMgL[]; int gMgD[]; int gMgKeep[]; int gMgDrop[];
// v2 location filters for the chart zones (all default off): merge overlap, HTF-zone side lock and Raja's curve
bool V2Hide(Zone &z)
  {
   if(InpMergeOverlap > 0) for(int k = 0; k < ArraySize(gMgL); k++) if(gMgL[k] == z.legBar && gMgD[k] == z.dir) return true;
#ifdef RFX_RJC
   if(RjC_Hidden(z)) return true;                                    // Raja v2.1 C: InpRjOnlyStrongArrival (off by default)
#endif
   if(!gDirOk) return false;
   if(InpLockSide && gLockSide != 0 && z.dir == -gLockSide) return true;
   if(InpCurveFilter && gCurveOk)
     {
      double c = DirCurveAt(z.prox);
      if(z.dir > 0 && c >= InpCurveHigh) return true;
      if(z.dir < 0 && c <= InpCurveLow) return true;
     }
   return false;
  }

string DirRowDetail(int r)
  {
   if(r < 0 || r >= drN) return "";
   if(!drRow[r].ok) return "not enough bars";
   string d = "";
   if(drRow[r].T != 0)
     {
      d = (drRow[r].T > 0 ? "downtrend line broken " : "uptrend line broken ") + TimeToString(drRow[r].tTime, TIME_DATE);
      d += StringFormat(", %d %s removed", drRow[r].rm, drRow[r].T > 0 ? (drRow[r].rm == 1 ? "supply" : "supplies") : (drRow[r].rm == 1 ? "demand" : "demands"));
     }
   else if(drRow[r].swingOnly) d = "swings only, no line broken";
   else d = (drRow[r].upOn && drRow[r].dnOn) ? "both lines intact" : "no swing / line direction";
   return d;
  }
string DirRowLine(int r)
  {
   string s = drRow[r].role + " " + DirTfName(drRow[r].tf) + "  " + DirStateName(drRow[r].st, drRow[r].side);
   if(drRow[r].ok) s += "  T" + DirSg(drRow[r].T) + " S" + DirSg(drRow[r].S) + " R" + IntegerToString(drRow[r].rm);
   if(r == drH && gCurveOk) s += StringFormat("  curve %.0f%%", gCurve);
   if(drRow[r].inZ != 0) s += drRow[r].inZ > 0 ? "  in demand" : "  in supply";
   if(drRow[r].ok && drRow[r].cp >= 2) s += StringFormat("  CP x%d", drRow[r].cp);
   if(drRow[r].note != "") s += "  (" + drRow[r].note + ")";
   return s;
  }

// conflict rules (spec 2.3): the first rule that fires sets the side; later rules only downgrade the quality
void DirCombine()
  {
   int side = 0, q = 2;
   bool realign = false;
   string rsCv = "", rsP1 = "", rsCP = "";
   gDirBlocked = 0;
   int hSide = DirTrendSide(drH);
   // rule 1: inside a fresh HTF (or Higher+1) zone
   gLockSide = 0; gLockLo = 0; gLockHi = 0; gLockTF = PERIOD_CURRENT;
   if(drH >= 0 && drRow[drH].inZ != 0) { gLockSide = drRow[drH].inZ; gLockLo = drRow[drH].inLo; gLockHi = drRow[drH].inHi; gLockTF = drRow[drH].tf; }
   else if(drP >= 0 && drRow[drP].inZ != 0) { gLockSide = drRow[drP].inZ; gLockLo = drRow[drP].inLo; gLockHi = drRow[drP].inHi; gLockTF = drRow[drP].tf; }
   if(gLockSide != 0) { side = gLockSide; if(hSide == -side) q = 1; }
   // rule 2: Raja's high / low curve
   if(gCurveOk)
     {
      int cv = gCurve >= InpCurveHigh ? -1 : (gCurve <= InpCurveLow ? 1 : 0);
      if(cv != 0)
        {
         gDirBlocked = -cv;
         if(side == 0) { side = cv; if(hSide == -side) q = 1; }
         else if(side != cv) { q = MathMin(q, 1); rsCv = " (curve disagrees)"; }
        }
     }
   // rule 3: the HTF is in control
   if(side == 0) side = hSide;
   if(side != 0)
     {
      // rule 4: Higher+1 (or macro) disagrees with the side
      if(drP >= 0 && DirRowSide(drP) == -side)
        {
         q = MathMin(q, 1);
         rsP1 = StringFormat("%s %s vs %s %s: correction, wait for confirmation", DirTfName(drRow[drP].tf), side > 0 ? "down" : "up", DirTfName(drH >= 0 ? drRow[drH].tf : PERIOD_CURRENT), side > 0 ? "up" : "down");
        }
      for(int r = 0; r < drN; r++)
         if(drRow[r].role == "MAC" && DirRowSide(r) == -side) { q = MathMin(q, 1); if(rsP1 == "") rsP1 = "macro " + DirTfName(drRow[r].tf) + " disagrees: correction"; break; }
      // rule 5: the ITF pulls back / turns against the side -> wait until it realigns (unless price sits in the HTF zone)
      if(drI >= 0 && drRow[drI].ok && (drRow[drI].st == DST_PULL || drRow[drI].st == DST_TURN) && drRow[drI].side == -side && gLockSide != side) { realign = true; q = 0; }
      // rule 6: ETF on the same side = full (3-TF confluence); otherwise at most reduced
      if(q > 0 && DirRowSide(drE) != side && !(InpDirTable == 3 && drE >= 0 && drRow[drE].tf < PERIOD_D1)) q = MathMin(q, 1);   // Raja v2.1 (B): table 3 = direction from D / W / M only, an intraday ETF does not grade it
      // rule 8: 3rd CP in a row on the ETF -> one step down
      if(drE >= 0 && drRow[drE].cp >= 3 && drRow[drE].cpDir == side && q > 0) { q--; rsCP = StringFormat("ETF %s CP x%d in a row: do not chase", DirTfName(drRow[drE].tf), drRow[drE].cp); }
     }
   gDirSide = side; gDirQ = side == 0 ? 0 : q; gDir = gDirQ > 0 ? side : 0; gDirRealign = realign;
   string sw = side > 0 ? "LONG" : "SHORT";
   if(side == 0) gDirHead = "DIRECTION: WAIT";
   else if(realign) gDirHead = "DIRECTION: WAIT - REALIGNING (" + (side > 0 ? "long" : "short") + " side)";
   else if(gDirQ == 0) gDirHead = "DIRECTION: WAIT (" + (side > 0 ? "long" : "short") + " side)";
   else gDirHead = "DIRECTION: " + sw + " - " + (gDirQ == 2 ? "FULL" : "REDUCED");
   if(gDirBlocked != 0) gDirHead += gDirBlocked > 0 ? " | buys BLOCKED" : " | sells BLOCKED";
   // reasons (up to 4)
   for(int k = 0; k < 4; k++) gDirTxt[k] = "";
   if(drH >= 0) gDirTxt[0] = "HTF " + DirTfName(drRow[drH].tf) + " " + DirStateName(drRow[drH].st, drRow[drH].side) + " (" + DirRowDetail(drH) + ")" + rsCv;
   if(side == 0 && gRangeLo > 0 && gRangeHi > 0) gDirTxt[0] += StringFormat(" | edges %s / %s", DoubleToString(gRangeLo, _Digits), DoubleToString(gRangeHi, _Digits));
   if(drI >= 0)
     {
      string it = "ITF " + DirTfName(drRow[drI].tf) + " " + DirStateName(drRow[drI].st, drRow[drI].side);
      if(realign) it += StringFormat(" (%d of %d %s removed) -> wait for %s to realign", drRow[drI].rm, MathMax(1, InpDirRemovedN), drRow[drI].T > 0 ? "supplies" : "demands", DirTfName(drRow[drI].tf));
      else if(side != 0) it += DirRowSide(drI) == side ? " agrees" : (DirRowSide(drI) == -side ? " against" : "");
      gDirTxt[1] = it;
     }
   string loc = gCurveOk ? StringFormat("Curve %.0f%% (%s%s)", gCurve, DirCurveWord(gCurve), gCurveRaja ? "" : ", v1 range") : "Curve n/a";
   if(gLockSide != 0) loc += StringFormat(" | inside %s %s %s-%s", DirTfName(gLockTF), gLockSide > 0 ? "demand" : "supply", DoubleToString(gLockLo, _Digits), DoubleToString(gLockHi, _Digits));
   gDirTxt[2] = loc;
   string l4 = "";
   if(rsP1 != "") l4 = rsP1;
   else if(drP >= 0) l4 = "+1 " + DirTfName(drRow[drP].tf) + " " + DirStateName(drRow[drP].st, drRow[drP].side) + (side != 0 && DirRowSide(drP) == side ? " agrees" : "");
   if(drE >= 0) l4 += (l4 == "" ? "" : " | ") + "ETF " + DirTfName(drRow[drE].tf) + " " + DirStateName(drRow[drE].st, drRow[drE].side);
   if(rsCP != "") l4 += " | " + rsCP;
   gDirTxt[3] = l4;
   for(int k = 0; k < 5; k++) gTFState[k] = 0;
   gTFState[0] = DirStateCode(drE); gTFState[1] = DirStateCode(drI); gTFState[2] = DirStateCode(drH); gTFState[3] = DirStateCode(drP);
   for(int r = 0; r < drN; r++) if(drRow[r].role == "MAC") { gTFState[4] = DirStateCode(r); break; }
  }

// pip size: 10 points on 3 / 5 digit symbols, 1 point otherwise; gold = InpPipXAU
double PipSize()
  {
   string u = _Symbol; StringToUpper(u);
   if(StringFind(u, "XAU") >= 0 || StringFind(u, "GOLD") >= 0) return InpPipXAU;
   return (_Digits == 3 || _Digits == 5) ? 10 * _Point : _Point;
  }
// origin zone of a line: the fresh same-side zone whose base holds the line's older anchor (or the nearest within 3 bars)
int DirOrigin(int r, TLine &t)
  {
   int best = -1, bd = 4;
   for(int i = 0; i < ArraySize(drZ); i++)
     {
      if(drZRow[i] != r || drZ[i].dir != t.dir) continue;            // down line -> supply at the older peak; up line -> demand at the older valley
      if(!DirFreshAt(drRow[r].tf, drZ[i])) continue;
      int L = drZ[i].legBar, B = drZ[i].legBar + drZ[i].baseN;
      int dd = t.a < L ? L - t.a : (t.a > B ? t.a - B : 0);
      if(dd < bd) { bd = dd; best = i; }
     }
   return best;
  }
// Raja's WOW ladder by trendline (spec 2.4, version 2) on the HTF and ITF rows
void DirWOW()
  {
   gWow1 = 0; gWow2 = 0; gWowN = 0; gWowPend = false;
   for(int k = 0; k < 4; k++) { gWowTxt[k] = ""; gWowPx[k] = 0; }
   if(!InpShowWOW) return;
   double mid = Mid(), spr = SAsk() - SBid(), pip = MathMax(PipSize(), _Point);
   int rows[2]; rows[0] = drH; rows[1] = drI;
   for(int q = 0; q < 2; q++)
     {
      int r = rows[q];
      if(r < 0 || !drRow[r].ok) continue;
      int nl = -1;                                                     // the newest crossed line of this row
      for(int i = 0; i < ArraySize(drTL); i++) if(drTLRow[i] == r && drTLX[i] >= 0 && (nl < 0 || drTLX[i] < drTLX[nl])) nl = i;
      if(nl < 0) continue;
      int ld = drTL[nl].dir, md = -ld;                                 // a broken down line (ld -1) -> targets above (md +1)
      // older lines of the same direction, newest anchor first, up to InpWOWLines
      int used[]; int nu = 0;
      for(int i = 0; i < ArraySize(drTL); i++)
        {
         if(drTLRow[i] != r || drTL[i].dir != ld || drTL[i].a < drTL[nl].a) continue;
         ArrayResize(used, nu + 1); used[nu] = i; nu++;
        }
      for(int a1 = 1; a1 < nu; a1++) { int v = used[a1], b1 = a1 - 1; while(b1 >= 0 && drTL[used[b1]].a > drTL[v].a) { used[b1 + 1] = used[b1]; b1--; } used[b1 + 1] = v; }
      double tg[2]; tg[0] = 0; tg[1] = 0; int nt = 0;
      for(int u = 0; u < nu && u < MathMax(1, InpWOWLines) && nt < 2; u++)
        {
         int oz = DirOrigin(r, drTL[used[u]]);
         if(oz < 0) continue;
         double px = drZ[oz].prox;
         if((md > 0 && px <= mid) || (md < 0 && px >= mid)) continue;   // a target lies ahead of price
         if(nt == 1 && MathAbs(px - tg[0]) < _Point) continue;
         tg[nt] = px; nt++;
        }
      if(nt == 0) continue;
      // risk for the R figure: the nearest fresh chart zone on the move's side
      double risk = 0, best = 0;
      for(int i = 0; i < ArraySize(Z); i++)
        {
         if(Z[i].dir != md || Z[i].removed || Z[i].tested) continue;
         double dd = MathAbs(mid - Z[i].prox);
         if(risk == 0 || dd < best) { best = dd; risk = MathAbs(Z[i].prox - Z[i].dist) + spr; }
        }
      bool pend = drRow[r].inZ == ld;                                  // price sits in a zone that stands against the move
      for(int t = 0; t < nt && gWowN < 4; t++)
        {
         double dist = MathAbs(tg[t] - mid);
         string s = "";
         if(pend) s = StringFormat("WOW pending %s: remove %s %s first", DirTfName(drRow[r].tf), DoubleToString(ld > 0 ? drRow[r].inHi : drRow[r].inLo, _Digits), ld > 0 ? "demand" : "supply");
         else
           {
            s = StringFormat("WOW%d %s -> %s (%s%.0f p", t + 1, DirTfName(drRow[r].tf), DoubleToString(tg[t], _Digits), md > 0 ? "+" : "-", dist / pip);
            if(risk > 0 && t == 0) s += StringFormat(", %.1fR", dist / risk);
            s += ")";
           }
         gWowTxt[gWowN] = s; gWowPx[gWowN] = tg[t]; gWowN++;
         if(t == 0 && gWow1 == 0) { gWow1 = tg[t]; gWowPend = pend; } // HTF ladder first, else the ITF one
         else if(t == 1 && gWow2 == 0) gWow2 = tg[t];
         if(pend) break;
        }
     }
  }

// ---- Raja v2.1 (B) ----
// Nested curve (L4): the HTF curve plus one nested level (D1 inside W1, W1 inside MN), realignment chain
// H4 -> D1 -> W1 -> MN with Raja's 'use once' rule (L8), the 250% projection target (L5, Feb 18) and the
// 'never trade sideways' check (L8) for the Raja lens. Host inputs: InpRjBLtfItf, InpRjBNestedCurve,
// InpRjBRealign, InpRjBProj, InpRjBProjX, InpRjBChop, InpRjBChopSwings, InpRjBChopTF (all default off).
#define RJB_MAXRA 3
bool     rjbNcOk = false;            // nested curve found
int      rjbNcRow = -1;              // its stack row
double   rjbNcPd = 0, rjbNcPs = 0;   // its demand proximal (0%) / supply proximal (100%)
double   rjbNcVal = 50;              // price on the nested curve (%)
bool     rjbNcInner = false;         // true = inner level (D1 inside W1), false = outer level (W1 around D1)
int      rjbRaN = 0;                 // realignment areas found
double   rjbRaLo[RJB_MAXRA], rjbRaHi[RJB_MAXRA];
int      rjbRaDir[RJB_MAXRA], rjbRaVis[RJB_MAXRA];
bool     rjbRaIn[RJB_MAXRA];
datetime rjbRaT[RJB_MAXRA];
string   rjbRaTxt[RJB_MAXRA];
ENUM_TIMEFRAMES rjbChTf[]; datetime rjbChT[]; bool rjbChV[];   // sideways cache (TF + last closed bar)

// Raja curve of one stack row: nearest fresh strong demand proximal below price, supply proximal above (as DirCurve)
bool RjB_RowCurve(int r, double &pd, double &ps)
  {
   pd = 0; ps = 0;
   if(r < 0 || r >= drN || !drRow[r].ok) return false;
   ENUM_TIMEFRAMES tf = drRow[r].tf;
   double mid = Mid();
   for(int i = 0; i < ArraySize(drZ); i++)
     {
      if(drZRow[i] != r || !DirFreshAt(tf, drZ[i]) || !DirRajaStrong(r, i)) continue;
      if(drZ[i].dir > 0 && drZ[i].dist < mid && (pd == 0 || drZ[i].prox > pd)) pd = drZ[i].prox;
      if(drZ[i].dir < 0 && drZ[i].dist > mid && (ps == 0 || drZ[i].prox < ps)) ps = drZ[i].prox;
     }
   return pd > 0 && ps > pd;
  }
// nested level: the D1+ row under the HTF (inner), else the Higher+1 row (outer)
void RjB_Nested()
  {
   rjbNcOk = false; rjbNcRow = -1; rjbNcPd = 0; rjbNcPs = 0; rjbNcVal = 50; rjbNcInner = false;
   if(!InpRjBNestedCurve || drH < 0 || drH >= drN || !drRow[drH].ok) return;
   int r = -1;
   if(drI >= 0 && drRow[drI].ok && drRow[drI].tf >= PERIOD_D1 && drRow[drI].tf != drRow[drH].tf) { r = drI; rjbNcInner = true; }
   else if(drP >= 0 && drRow[drP].ok && drRow[drP].tf != drRow[drH].tf) { r = drP; rjbNcInner = false; }
   if(r < 0) return;
   double pd = 0, ps = 0;
   if(!RjB_RowCurve(r, pd, ps)) return;
   rjbNcOk = true; rjbNcRow = r; rjbNcPd = pd; rjbNcPs = ps;
   rjbNcVal = 100.0 * (Mid() - pd) / (ps - pd);
  }
// realignment chain (L8): a lower row (H4+) crossed its line and removed N opposite zones -> price returns to
// the lower-TF zone of the new side that sits inside / next to an upper-TF zone of that side. Used once.
void RjB_Realign()
  {
   rjbRaN = 0;
   if(!InpRjBRealign) return;
   double mid = Mid();
   int N = MathMax(1, InpDirRemovedN);
   for(int r = 0; r + 1 < drN && rjbRaN < RJB_MAXRA; r++)
     {
      int u = r + 1;
      if(!drRow[r].ok || !drRow[u].ok || drRow[r].role == "MAC") continue;
      ENUM_TIMEFRAMES lt = drRow[r].tf, ut = drRow[u].tf;
      if(lt < PERIOD_H4 || ut <= lt) continue;
      int T = drRow[r].T, tb = drRow[r].tBar;
      if(T == 0 || tb < 1 || drRow[r].rm < N) continue;
      int bl = -1; double bd = 0;
      for(int i = 0; i < ArraySize(drZ); i++)
        {
         if(drZRow[i] != r || drZ[i].dir != T || drZ[i].removed) continue;
         if(T > 0 ? drZ[i].dist >= mid : drZ[i].dist <= mid) continue;        // on the retrace side of price
         double llo = MathMin(drZ[i].prox, drZ[i].dist), lhi = MathMax(drZ[i].prox, drZ[i].dist);
         bool paired = false;
         for(int j = 0; j < ArraySize(drZ) && !paired; j++)
           {
            if(drZRow[j] != u || drZ[j].dir != T || drZ[j].removed) continue;
            double ulo = MathMin(drZ[j].prox, drZ[j].dist), uhi = MathMax(drZ[j].prox, drZ[j].dist);
            double tol = InpNestTolH * (uhi - ulo);
            if(lhi >= ulo - tol && llo <= uhi + tol) paired = true;               // inside or next to the upper zone
           }
         if(!paired) continue;
         double dd = MathAbs(mid - drZ[i].prox);
         if(bl < 0 || dd < bd) { bl = i; bd = dd; }
        }
      if(bl < 0) continue;
      double lo = MathMin(drZ[bl].prox, drZ[bl].dist), hi = MathMax(drZ[bl].prox, drZ[bl].dist);
      int fromBar = MathMin(tb - 1, drZ[bl].saBar - 1);
      int vis = 0; bool inNow = false;
      for(int k = fromBar; k >= 0; k--)
        {
         bool hit = SL(_Symbol, lt, k) <= hi && SH(_Symbol, lt, k) >= lo;
         if(hit && !inNow) vis++;
         inNow = hit;
        }
      string st = vis == 0 ? "use once" : ((vis == 1 && inNow) ? "1st visit: entry area" : "USED: do not reuse");
      int n = rjbRaN;
      rjbRaLo[n] = lo; rjbRaHi[n] = hi; rjbRaDir[n] = T; rjbRaVis[n] = vis; rjbRaIn[n] = inNow;
      rjbRaT[n] = ST(_Symbol, lt, tb);
      rjbRaTxt[n] = StringFormat("REALIGN %s+%s %s (%s cross, %d removed): %s", TfName(ut), TfName(lt), T > 0 ? "demand" : "supply", TfName(lt), drRow[r].rm, st);
      rjbRaN++;
     }
  }
// 250% projection (L5, Feb 18): no fresh opposite zone ahead on this or a higher row -> measure the correction
// (buy: the newest swing low and the swing high before it); the impulse runs 100% + 100% + 50% of it from the low.
void RjB_Proj()
  {
   if(!InpRjBProj || !InpShowWOW) return;
   double mid = Mid(), pip = MathMax(PipSize(), _Point);
   int rows[2]; rows[0] = drH; rows[1] = drI;
   for(int q = 0; q < 2 && gWowN < 4; q++)
     {
      int r = rows[q];
      if(r < 0 || r >= drN || !drRow[r].ok) continue;
      ENUM_TIMEFRAMES tf = drRow[r].tf;
      int md = drRow[r].T != 0 ? drRow[r].T : DirTrendSide(r);
      if(md == 0) continue;
      bool opp = false;
      for(int i = 0; i < ArraySize(drZ) && !opp; i++)
        {
         int zr = drZRow[i];
         if(zr < 0 || zr >= drN || drRow[zr].tf < tf || drZ[i].dir != -md) continue;
         if(!DirFreshAt(drRow[zr].tf, drZ[i])) continue;
         if(md > 0 ? drZ[i].prox > mid : drZ[i].prox < mid) opp = true;
        }
      if(opp) continue;
      int nb = SBars(_Symbol, tf), lim = MathMin(nb - InpTLSwing - 1, 400);
      int be = -1, bs = -1;
      for(int j = InpTLSwing + 1; j < lim; j++)
        {
         if(be < 0) { if(DnaFrac(tf, j, md)) be = j; continue; }             // correction end: swing low (buy) / swing high (sell)
         if(DnaFrac(tf, j, -md)) { bs = j; break; }                          // correction start: the swing high (buy) / low (sell) before it
        }
      if(be < 0 || bs < 0) continue;
      double cEnd = md > 0 ? SL(_Symbol, tf, be) : SH(_Symbol, tf, be);
      double cStart = md > 0 ? SH(_Symbol, tf, bs) : SL(_Symbol, tf, bs);
      double corr = md * (cStart - cEnd);
      if(corr <= 0) continue;
      double px = cEnd + md * MathMax(0.1, InpRjBProjX) * corr;
      if(md * (px - mid) <= 0) continue;                                     // reached: the impulse is done, expect a correction
      bool dup = false;
      for(int k = 0; k < gWowN; k++) if(MathAbs(gWowPx[k] - px) < _Point) dup = true;
      if(dup) continue;
      gWowTxt[gWowN] = StringFormat("P%.0f %s -> %s (%s%.0f p, %.1fx corr %s-%s, no opposite zone)", InpRjBProjX * 100, DirTfName(tf), DoubleToString(px, _Digits),
                                    md > 0 ? "+" : "-", MathAbs(px - mid) / pip, InpRjBProjX, DoubleToString(cStart, _Digits), DoubleToString(cEnd, _Digits));
      gWowPx[gWowN] = px; gWowN++;                                           // ladder only: gWow1 / gWow2 (alerts, export) stay the WOW targets
     }
  }
// never trade sideways (L8): the last swings overlap with no new HH + HL / LL + LH and no close outside them
bool RjB_Sideways(ENUM_TIMEFRAMES tf)
  {
   datetime t1 = ST(_Symbol, tf, 1);
   for(int c = 0; c < ArraySize(rjbChTf); c++) if(rjbChTf[c] == tf && rjbChT[c] == t1) return rjbChV[c];
   int K = MathMax(2, MathMin(8, InpRjBChopSwings));
   double hs[8], ls[8];
   int nh = 0, nl = 0;
   int nb = SBars(_Symbol, tf), lim = MathMin(nb - InpTLSwing - 1, 400);
   for(int j = InpTLSwing + 1; j < lim && (nh < K || nl < K); j++)
     {
      if(nh < K && DnaFrac(tf, j, -1)) { hs[nh] = SH(_Symbol, tf, j); nh++; }
      if(nl < K && DnaFrac(tf, j, 1))  { ls[nl] = SL(_Symbol, tf, j); nl++; }
     }
   bool v = false;
   if(nh >= K && nl >= K)
     {
      bool up = hs[0] > hs[1] && ls[0] > ls[1], dn = hs[0] < hs[1] && ls[0] < ls[1];
      if(!up && !dn)
        {
         double minH = hs[0], maxH = hs[0], minL = ls[0], maxL = ls[0];
         for(int k = 1; k < K; k++) { minH = MathMin(minH, hs[k]); maxH = MathMax(maxH, hs[k]); minL = MathMin(minL, ls[k]); maxL = MathMax(maxL, ls[k]); }
         double c = SC(_Symbol, tf, 1);
         v = minH > maxL && c <= maxH && c >= minL;                            // one common band, price still inside the swings
        }
     }
   int n = ArraySize(rjbChTf);
   if(n >= 16) { n = 0; ArrayResize(rjbChTf, 0); ArrayResize(rjbChT, 0); ArrayResize(rjbChV, 0); }
   ArrayResize(rjbChTf, n + 1); ArrayResize(rjbChT, n + 1); ArrayResize(rjbChV, n + 1);
   rjbChTf[n] = tf; rjbChT[n] = t1; rjbChV[n] = v;
   return v;
  }
void RjB_Run()
  {
   RjB_Nested();
   RjB_Realign();
   RjB_Proj();
  }
// ---- end Raja v2.1 (B) ----

// the whole engine, once per redraw (after the chart's Detect / Trendlines / Qualify)
void DirRun()
  {
   gDirOk = false; drN = 0; drE = -1; drI = -1; drH = -1; drP = -1;
   ArrayResize(drZ, 0); ArrayResize(drZRow, 0); ArrayResize(drTL, 0); ArrayResize(drTLRow, 0); ArrayResize(drTLX, 0);
   if(!InpDirEngine) return;
   ENUM_TIMEFRAMES itf = PERIOD_CURRENT, htf = PERIOD_CURRENT, p1 = PERIOD_CURRENT;
   if(!DirTable(CTF, itf, htf, p1)) return;
   VBuildAll();
   ENUM_TIMEFRAMES tfs[DMAXROW]; string rl[DMAXROW];
   for(int k = 0; k < DMAXROW; k++) { tfs[k] = PERIOD_CURRENT; rl[k] = ""; }
   int n = 0;
   tfs[n] = CTF; rl[n] = "ETF"; drE = n; n++;
   tfs[n] = itf; rl[n] = "ITF"; drI = n; n++;
   tfs[n] = htf; rl[n] = "HTF"; drH = n; n++;
   if(InpDirPlus1 && p1 != PERIOD_CURRENT) { tfs[n] = p1; rl[n] = "+1"; drP = n; n++; }
   ENUM_TIMEFRAMES b = DirStd(CTF);
   if(InpDirMacro && (b == PERIOD_H4 || b == PERIOD_D1))
     {
      tfs[n] = PERIOD_MN1; rl[n] = "MAC"; n++;
      tfs[n] = (ENUM_TIMEFRAMES)TFV_3M; rl[n] = "MAC"; n++;
      tfs[n] = (ENUM_TIMEFRAMES)TFV_6M; rl[n] = "MAC"; n++;
      tfs[n] = (ENUM_TIMEFRAMES)TFV_12M; rl[n] = "MAC"; n++;
     }
   drN = n;
   DirSave();
   gQuiet = true;
   for(int r = 0; r < drN; r++)
     {
      drRow[r].tf = tfs[r]; drRow[r].role = rl[r]; drRow[r].note = "";
      if(VIsTF(tfs[r]) && SBars(_Symbol, tfs[r]) < 40 && rl[r] != "MAC")   // too little MN1 history: the stack falls back to MN1
        { drRow[r].note = TfName(tfs[r]) + " n/a: MN used"; drRow[r].tf = PERIOD_MN1; }
      DirEvalTF(r);
     }
   DirRestore();
   DirCurve();
   DirCombine();
   DirWOW();
   RjB_Run();                                                        // Raja v2.1 (B): nested curve, realignment areas, 250% projection (all default off)
   gDirOk = true;
  }

//+------------------------------------------------------------------+
//| v2 Zone DNA (spec 3) + mentor lenses + consensus (spec 4)        |
//| DnaCompute() fills one ZoneDNA from a detected zone list. It only|
//| READS the v1 outputs (Zone fields, Qualify, TooSmall, the chart  |
//| lines) and the Direction engine; it changes no Zone field and    |
//| draws nothing. LensRun() scores the DNA through Kevin (the v1    |
//| ZoneNotes verdict, unchanged), Seiden (10-point sheet), Raja     |
//| (zone types), Baker (speed / fresh / time) and the weighted      |
//| consensus -> verdict A+ / A / B / C / X. Lenses never draw.      |
//| Host contract (adds to the one above): inputs InpDNA,            |
//| InpBaseMedianN, InpGapATR, InpATHBars, InpOriginBars,            |
//| InpNestTolH, InpIndexOpen, InpResearchGMT, InpKevinPlus,         |
//| InpSeidenDepth, InpConfOffsetFrac, InpWKevin, InpWSeiden,        |
//| InpWRaja, InpWBaker, InpMergeOverlap, InpMergeMinPct.            |
//+------------------------------------------------------------------+
#define RT_ARR 1
#define RT_WOW 2
#define RT_STR 3
#define RT_OVL 4
#define RT_INH 5
#define RT_FLP 6
#define RT_OTL 7
#define RT_TST 8
#define RT_WK  9

struct ZoneDNA
  {
   bool     ok;
   string   key;                     // tf | d | base-start time (cache id)
   ENUM_TIMEFRAMES tf;
   int      d, L, k, B, sa;
   double   prox, dist, h, A, A1;
   bool     cont, removed;
   // F01-F08 departure / base / leg-in / leg-out / gap
   int      baseN;
   double   baseRel, baseMin;
   double   leginAtr, leginSpd;
   int      leginN;
   double   legRatio, legoutAtr, legoutBody, legoutSpd, legoutRel;
   int      legoutN;
   double   gapOpen, gap;
   bool     gapAway;
   int      departure;
   // F09-F15 run-out / chain
   double   runoutH, runoutAtr, runoutPx;
   int      runoutBars, runoutBar;
   int      rmOppN, rmOppMove;
   bool     chain, rmOppZone, rmTL, newHL, rmPrevHL, arrival, leg2;
   bool     ath, arrivalRaja, rajaStrong;
   // F16 tests
   int      nTests, touch1Bar;
   double   depthMax, depth1, emoDepth;
   string   depthGrade;
   bool     retNext, inTouch;
   // F17 nested / inside an opposite HTF zone
   bool     nested, inOppHtf;
   ENUM_TIMEFRAMES nestTf, oppHtfTf;
   double   nestPos, nestLo, nestHi;
   // F18 curve
   double   curve, curveZone;
   string   curveBucket;
   bool     curveRaja;
   // F19 room
   double   oppR, oppHtfR, roomR, wowPips, wowPx;
   bool     hasOpp, hasOppHtf, wowZ;
   // F20 origin
   int      originOk;                // 1 ok, 0 the base retested older price, -1 n/a (CP)
   double   leftOppR;                // -1 = no older opposite level found
   // F21-F23
   bool     emotional, tooSmall;
   int      noviceN;
   double   heightAtr, heightPts, heightPips, heightVsMed;
   string   session;
   int      hour, weekday, minFromOpen;
   // F24-F26 context, weak types, Raja type
   bool     trap, crowded, nearTl, overext, impulse, stacked;
   int      crossNeeded, cpRun;
   bool     inherit, overlap, flip, outTl, rajaLive;
   string   rajaType;
   int      rajaCode;
   // F27 approach (provisional while untouched)
   int      apprBars, newOppWay;
   double   apprSpd;
   bool     stair, apprProv;
   // F28 Direction snapshot
   int      dir, dirq, align, stE, stI, stH, stP;
   // F29 plan
   double   planRR, stopAtr;
   // ---- Raja v2.1 (A) ---- (all 0 / false unless the RjA_* switches are on)
   bool     rjaTL;                   // the run-out crossed an opposite trendline by a close / departure candle (RjA_ArrDepart)
   bool     rjaAdj;                  // formed right next to a live older opposite zone, no gap (RjA_Adjacent)
   bool     rjaNextOppHtf;           // inside or within one zone height of an opposite HtfOf zone (RjA_OppHtfVeto)
   double   rjaLineDist;             // pips from the zone to its own-side trendline now (-1 = no line; RjA_NearLine / RjA_TLTouch)
   int      rjaLineT;                // touches of that line (0 = not counted)
   bool     rjaNearest;              // the live same-side zone nearest that line
   int      rjaPCP;                  // P vs CP: -1 a P sits right next to this CP (prefer the P), 1 this P has a CP next to it, 2 CP with a gap from the P
   bool     rjaDidJob;               // the run-out reached its target (next opposite zone) before price came back
   double   rjaJobPx;                // that target
  };

struct LensOut
  {
   bool     ok;
   // Kevin (v1 ZoneNotes verdict)
   string   kVer, kGrade, kPlus, kMinus;
   int      kNP, kNM, kNC, scoreK, emK;
   bool     passK, kVoid, kAssert;
   // Seiden
   int      sDep, sMar, sBig, sTst, sTim, sArr, scoreS, emS;
   bool     sArrProv, passS, vetoS, golden;
   string   sNote;
   // Raja
   int      scoreR, emR;
   bool     passR;
   string   rTouch, rCurve, rNote;
   // Baker
   int      bOut, bIn, bFresh, bTime, scoreB, emB;
   bool     passB, vetoB;
   double   bDeep;
   string   bNote;
   // consensus
   double   cons;
   int      nPass, vcode;            // vcode: A+ 4, A 3, B 2, C 1, X 0
   string   verdict, conf;           // conf: conflict lines, '\n' separated
  };

Zone     dnHz[];                     // HtfOf(chart) zones for in_opp_htf (v1 research rule), refreshed by DnaPrepare
int      gLensD1 = 0;                // D1 side for Seiden's big picture (+1 / -1, 0 = range / unknown)
string   dcKey[]; bool dcAth[]; int dcOrig[]; double dcLeft[];   // per-zone cache of the long scans (F13, F20)
int      gDnaTestStop = 0;           // research touch snapshot: DnaTests ignores bars <= this (0 = every bar, the chart)

string DnaTypeName(int c)
  {
   switch(c)
     {
      case RT_ARR: return "ARR";
      case RT_WOW: return "WOW";
      case RT_STR: return "STR";
      case RT_OVL: return "OVL";
      case RT_INH: return "INH";
      case RT_FLP: return "FLP";
      case RT_OTL: return "OTL";
      case RT_TST: return "TST";
      default: break;
     }
   return "WK";
  }
int    DnaTfSec(ENUM_TIMEFRAMES tf) { if(VIsTF(tf)) return rvMonths[VSlot(tf)] * 30 * 86400; return PeriodSeconds(tf); }
double DnaExt(ENUM_TIMEFRAMES tf, int d, int j) { return d > 0 ? SH(_Symbol, tf, j) : SL(_Symbol, tf, j); }   // favourable extreme
double DnaAdv(ENUM_TIMEFRAMES tf, int d, int j) { return d > 0 ? SL(_Symbol, tf, j) : SH(_Symbol, tf, j); }   // adverse extreme
// fractal low (side +1) / high (side -1) with InpTLSwing bars each side, the v1 FrLow / FrHigh rule on any TF
bool DnaFrac(ENUM_TIMEFRAMES tf, int i, int side)
  {
   int nb = SBars(_Symbol, tf);
   for(int j = 1; j <= InpTLSwing; j++)
     {
      if(i - j < 1 || i + j >= nb) return false;
      if(side > 0 && (SL(_Symbol, tf, i) > SL(_Symbol, tf, i + j) || SL(_Symbol, tf, i) >= SL(_Symbol, tf, i - j))) return false;
      if(side < 0 && (SH(_Symbol, tf, i) < SH(_Symbol, tf, i + j) || SH(_Symbol, tf, i) <= SH(_Symbol, tf, i - j))) return false;
     }
   return true;
  }
// opposite zones removed with removedBar in [newest, L] that are older than the zone (F10 window = L - 5)
int DnaRmOpp(Zone &zs[], int i, int newest)
  {
   int c = 0, L = zs[i].legBar;
   for(int j = 0; j < ArraySize(zs); j++)
      if(zs[j].dir == -zs[i].dir && zs[j].removed && zs[j].legBar > L && zs[j].removedBar <= L && zs[j].removedBar >= newest) c++;
   return c;
  }
// F16: touches after the stay-away (a touch needs a candle fully outside the proximal before it; emotional candles excluded)
void DnaTests(ENUM_TIMEFRAMES tf, Zone &z, ZoneDNA &x)
  {
   int d = z.dir;
   double h = MathAbs(z.prox - z.dist);
   x.nTests = 0; x.touch1Bar = -1; x.depthMax = 0; x.depth1 = 0; x.emoDepth = 0; x.inTouch = false;
   bool away = true, inT = false;
   int stop = z.removed ? z.removedBar : 0;
   if(gDnaTestStop > stop) stop = gDnaTestStop;                       // research touch snapshot: the touch candle itself is not a prior test
   for(int j = z.saBar - 1; j >= 1 && j > stop; j--)
     {
      double adv = DnaAdv(tf, d, j);
      bool touch = d > 0 ? adv <= z.prox : adv >= z.prox;
      double dep = h > 0 ? d * (z.prox - adv) / h * 100.0 : 0;
      if(touch && Emotional(_Symbol, tf, j)) { x.emoDepth = MathMax(x.emoDepth, dep); continue; }
      if(touch)
        {
         if(!inT && away) { x.nTests++; inT = true; away = false; if(x.nTests == 1) x.touch1Bar = j; }
         x.depthMax = MathMax(x.depthMax, dep);
         if(x.nTests == 1) x.depth1 = MathMax(x.depth1, dep);
        }
      else { away = true; inT = false; }
     }
   x.inTouch = inT;
   x.depthGrade = x.nTests == 0 ? "F" : (x.depthMax <= 25 ? "S" : (x.depthMax <= 50 ? "M" : (x.depthMax <= 75 ? "D" : "V")));
   x.retNext = x.touch1Bar >= 0 && x.touch1Bar >= z.saBar - 2;
  }
// minutes since the nearest session open before t: London 07:00 UTC, New York 12:00 UTC (13:30 with InpIndexOpen)
int DnaMinFromOpen(datetime t)
  {
   MqlDateTime md; ZeroMemory(md);
   TimeToStruct((datetime)((long)t - (long)InpResearchGMT * 3600), md);
   int m = md.hour * 60 + md.min, o1 = 420, o2 = InpIndexOpen ? 810 : 720;
   if(m >= o2) return m - o2;
   if(m >= o1) return m - o1;
   return m + 1440 - o2;
  }
int DnaCacheFind(string key) { for(int c = ArraySize(dcKey) - 1; c >= 0; c--) if(dcKey[c] == key) return c; return -1; }
void DnaCacheAdd(string key, bool ath, int orig, double left)
  {
   int n = ArraySize(dcKey);
   if(n >= 300) { ArrayResize(dcKey, 0); ArrayResize(dcAth, 0); ArrayResize(dcOrig, 0); ArrayResize(dcLeft, 0); n = 0; }
   ArrayResize(dcKey, n + 1); ArrayResize(dcAth, n + 1); ArrayResize(dcOrig, n + 1); ArrayResize(dcLeft, n + 1);
   dcKey[n] = key; dcAth[n] = ath; dcOrig[n] = orig; dcLeft[n] = left;
  }
// once per redraw, before DnaCompute on chart zones: the HtfOf(chart) zones and the D1 side for Seiden
void DnaPrepare()
  {
   ArrayResize(dnHz, 0);
   ENUM_TIMEFRAMES ht = HtfOf(CTF);
   if(ht > 0) Detect(_Symbol, ht, dnHz, false);
   gLensD1 = 0;
   int r1 = -1;
   if(gDirOk) for(int r = 0; r < drN; r++) if(drRow[r].ok && drRow[r].tf == PERIOD_D1) { r1 = r; break; }
   if(r1 >= 0) gLensD1 = DirRowSide(r1);
   else if(gDirOk && CTF >= PERIOD_D1 && drH >= 0) gLensD1 = DirRowSide(drH);
   else gLensD1 = HtfTrend(_Symbol, PERIOD_D1);
  }

// ---- Raja v2.1 (A) ----
// cross bar of a chart (CTF) line, Raja style: with InpDirDepartATR > 0 the departure close of DirCrossBar, else the
// first candle that CLOSES beyond the line (any body). -1 = not crossed.
int RjA_CrossBar(TLine &t)
  {
   if(InpDirDepartATR > 0) return DirCrossBar(CTF, t);
   double slp = (t.pb - t.pa) / MathMax(1, t.a - t.b);
   for(int j = t.b - 1; j >= 1; j--)
     {
      double lv = LineAt(t.pb, t.b, slp, j), c = SC(_Symbol, CTF, j);
      if(t.dir > 0 ? c < lv : c > lv) return j;
     }
   return -1;
  }
// a chart line of direction ldir crossed (RjA_CrossBar) on a bar in [lo, hi] (TL = this chart's lines)
bool RjA_TLCrossIn(int ldir, int lo, int hi)
  {
   for(int t = 0; t < ArraySize(TL); t++)
     {
      if(TL[t].dir != ldir) continue;
      int cb = RjA_CrossBar(TL[t]);
      if(cb >= 0 && cb >= lo && cb <= hi) return true;
     }
   return false;
  }
// the zone's own-side trendline now (demand: the up line, supply: the down line): this chart's newest respected one,
// else the HtfOf one; false = none. lv = its price on the current bar, nt = its touches (0 = not counted)
bool RjA_LineNow(int d, double &lv, int &nt)
  {
   lv = 0; nt = 0;
   if(d > 0 && gUpOn) { lv = LineAt(gUpP, gUpB, gUpS, 0); nt = RjA_UpT; return true; }
   if(d < 0 && gDnOn) { lv = LineAt(gDnP, gDnB, gDnS, 0); nt = RjA_DnT; return true; }
   if(gHTF > 0)
     {
      int sh = iBarShift(_Symbol, gHTF, cT(0));
      if(d > 0 && gHUpOn) { lv = gHUpP + gHUpS * (gHUpB - sh); nt = RjA_HUpT; return true; }
      if(d < 0 && gHDnOn) { lv = gHDnP + gHDnS * (gHDnB - sh); nt = RjA_HDnT; return true; }
     }
   return false;
  }
// pips from a price level to a zone's range (0 = the level is inside the zone)
double RjA_PipsTo(double lv, double p1, double p2)
  {
   double lo = MathMin(p1, p2), hi = MathMax(p1, p2), pip = MathMax(PipSize(), _Point);
   if(lv >= lo && lv <= hi) return 0;
   return MathMin(MathAbs(lv - lo), MathAbs(lv - hi)) / pip;
  }
// DNA extras of the Raja v2.1 (A) rules (only with their switches on; chart TF only, like the other line reads)
void RjA_DnaExtra(ENUM_TIMEFRAMES tf, Zone &zs[], int i, ZoneDNA &x)
  {
   x.rjaLineDist = -1; x.rjaLineT = 0; x.rjaNearest = false; x.rjaPCP = 0; x.rjaDidJob = false; x.rjaJobPx = 0; x.rjaNextOppHtf = false;
   if(tf != CTF) return;
   int nz = ArraySize(zs), d = x.d;
   double h = x.h, zlo = MathMin(x.prox, x.dist), zhi = MathMax(x.prox, x.dist);
   //--- distance to its trendline, the line's touches, nearest live same-side zone to that line (L4, Mar 5, Jun 25)
   double lv = 0; int nt = 0;
   if((RjA_NearLine || RjA_TLTouch) && RjA_LineNow(d, lv, nt))
     {
      x.rjaLineT = nt;
      x.rjaLineDist = RjA_PipsTo(lv, x.prox, x.dist);
      x.rjaNearest = true;
      for(int j = 0; j < nz && x.rjaNearest; j++)
        {
         if(j == i || zs[j].dir != d || zs[j].removed || zs[j].legBar > InpMaxZoneAge) continue;
         if(RjA_PipsTo(lv, zs[j].prox, zs[j].dist) < x.rjaLineDist) x.rjaNearest = false;
        }
     }
   //--- strong zone inside / right next to an opposite HtfOf zone (private 2022: it gets removed, not respected)
   if(RjA_OppHtfVeto)
      for(int j = 0; j < ArraySize(dnHz); j++)
        {
         if(dnHz[j].removed || dnHz[j].dir == d) continue;
         double lo2 = MathMin(dnHz[j].prox, dnHz[j].dist), hi2 = MathMax(dnHz[j].prox, dnHz[j].dist);
         if(MathMax(zlo, lo2) - MathMin(zhi, hi2) <= h) { x.rjaNextOppHtf = true; break; }
        }
   if(!RjA_Lens8) return;
   //--- P vs CP (L104): a CP right next to the P (no gap) -> prefer the P; a CP that formed nearer price with a gap -> use the CP
   double bestGap = -1; int bj = -1;
   for(int j = 0; j < nz; j++)
     {
      if(j == i || zs[j].dir != d || zs[j].removed || zs[j].cont == x.cont) continue;
      double lo2 = MathMin(zs[j].prox, zs[j].dist), hi2 = MathMax(zs[j].prox, zs[j].dist);
      double gp = MathMax(0.0, MathMax(zlo, lo2) - MathMin(zhi, hi2));
      if(bj < 0 || gp < bestGap) { bj = j; bestGap = gp; }
     }
   if(bj >= 0)
     {
      if(bestGap <= 0.1 * h) x.rjaPCP = x.cont ? -1 : 1;
      else if(x.cont && bestGap <= 3 * h && d * (x.prox - zs[bj].prox) > 0) x.rjaPCP = 2;
     }
   //--- the zone already did its job (L5, Feb 18): the run-out reached the next opposite zone (one it did not remove) before price came back
   double tg = 0;
   for(int j = 0; j < nz; j++)
     {
      if(zs[j].dir == d || zs[j].legBar <= x.L) continue;              // older opposite zones only
      if(zs[j].removed && zs[j].removedBar >= x.runoutBar) continue;   // removed before the base or by this run-out: not the target
      if(d * (zs[j].prox - x.prox) <= 0) continue;
      if(tg == 0 || d * (zs[j].prox - tg) < 0) tg = zs[j].prox;
     }
   if(tg != 0 && d * (x.runoutPx - tg) >= 0) { x.rjaDidJob = true; x.rjaJobPx = tg; }
  }

// the whole DNA of zs[i] on timeframe tf (spec 3, F01-F29; planRR / stopAtr are set by the host from the v1 plan)
void DnaCompute(ENUM_TIMEFRAMES tf, Zone &zs[], int i, ZoneDNA &x)
  {
   ZeroMemory(x);
   x.ok = false;
   int nz = ArraySize(zs);
   if(i < 0 || i >= nz) return;
   Zone z = zs[i];
   int d = z.dir, L = z.legBar, k = z.baseN, B = z.legBar + z.baseN, sa = z.saBar;
   int nb = SBars(_Symbol, tf);
   double h = MathAbs(z.prox - z.dist);
   if(L < 2 || B + 3 >= nb || h <= 0) return;
   double A = ATR(tf, L), A1 = ATR(tf, 1);
   if(A <= 0) A = A1;
   if(A1 <= 0) A1 = A;
   if(A <= 0) return;
   double spr = MathMax(SAsk() - SBid(), 0.0), risk = h + spr + RjC_RoomBuf(h, tf), pip = MathMax(PipSize(), _Point);   // Raja v2.1 C: + % stop (InpSlMode 1)
   x.tf = tf; x.d = d; x.L = L; x.k = k; x.B = B; x.sa = sa; x.prox = z.prox; x.dist = z.dist; x.h = h; x.A = A; x.A1 = A1;
   x.cont = z.cont; x.removed = z.removed;
   x.key = TfName(tf) + "|" + IntegerToString(d) + "|" + IntegerToString((long)ST(_Symbol, tf, B));
   //--- F01-F03 base
   x.baseN = k;
   double bs[]; int nbs = 0;
   for(int j = i; j >= 0 && nbs < MathMax(1, InpBaseMedianN); j--) { ArrayResize(bs, nbs + 1); bs[nbs] = zs[j].baseN; nbs++; }   // the zone and the older ones (list is oldest first)
   double medB = k;
   if(nbs > 0) { ArraySort(bs); medB = bs[nbs / 2]; }
   x.baseRel = medB > 0 ? k / medB : 1;
   x.baseMin = k * DnaTfSec(tf) / 60.0;
   //--- F04 leg-in
   x.leginAtr = Rng(_Symbol, tf, B + 1) / A;
   int want = z.cont ? d : -d, lin = 0;
   for(int j = B + 1; j < nb - 1 && lin < 10; j++) { if(Basing(_Symbol, tf, j) || CDir(_Symbol, tf, j) != want) break; lin++; }
   x.leginN = lin;
   x.leginSpd = lin > 0 ? MathAbs(SO(_Symbol, tf, B + lin) - SC(_Symbol, tf, B + 1)) / (A * lin) : 0;
   //--- F05 leg-out
   x.legRatio = z.legRatio;
   double rl = Rng(_Symbol, tf, L);
   x.legoutAtr = rl / A;
   x.legoutBody = rl > 0 ? Body(_Symbol, tf, L) / rl : 0;
   int lout = 0;
   for(int j = L; j >= 1 && lout < 10; j--) { if(Basing(_Symbol, tf, j) || CDir(_Symbol, tf, j) != d) break; lout++; }
   x.legoutN = lout;
   x.legoutSpd = lout > 0 ? MathAbs(SC(_Symbol, tf, L - lout + 1) - SO(_Symbol, tf, L)) / (A * lout) : 0;
   double rg[]; int nrg = 0;
   for(int j = B + 1; j <= B + 20 && j < nb; j++) { ArrayResize(rg, nrg + 1); rg[nrg] = Rng(_Symbol, tf, j); nrg++; }
   double medR = 0;
   if(nrg > 0) { ArraySort(rg); medR = rg[nrg / 2]; }
   x.legoutRel = medR > 0 ? rl / medR : 0;
   //--- F06-F08 gap / departure
   x.gapOpen = d * (SO(_Symbol, tf, L) - SC(_Symbol, tf, L + 1)) / A;
   bool win = sa >= 1 && d * (DnaAdv(tf, d, sa) - DnaExt(tf, d, L + 1)) > 0;   // window between the last base candle and the stay-away candle
   x.gapAway = x.gapOpen >= InpGapATR || win;
   x.departure = x.gapAway ? 3 : ((z.legRatio >= 2.5 || x.legoutAtr >= 2.0) ? 2 : (z.legRatio >= 1.8 ? 1 : 0));
   x.gap = z.gap;
   //--- F16 tests (the run-out below stops at the first touch)
   DnaTests(tf, z, x);
   //--- F09 run-out before the first touch
   int last = x.touch1Bar >= 0 ? x.touch1Bar + 1 : 1;
   if(z.removed) last = MathMax(last, z.removedBar + 1);
   double best = 0; int bb = sa;
   for(int j = sa; j >= last && j >= 1; j--) { double v = d * (DnaExt(tf, d, j) - z.prox); if(v > best) { best = v; bb = j; } }
   x.runoutH = best / h; x.runoutAtr = best / A; x.runoutBar = bb; x.runoutBars = L - bb; x.runoutPx = z.prox + d * best;
   //--- F10-F15 chain
   x.rmOppN = DnaRmOpp(zs, i, L - 5);
   x.rmOppMove = DnaRmOpp(zs, i, MathMin(bb, L - 5));
   string q = z.qual;
   x.chain = z.chain; x.arrival = z.arrival; x.leg2 = z.leg2;
   x.rmOppZone = StringFind(q, "removed opp. zone") >= 0; x.rmTL = StringFind(q, "removed trendline") >= 0;
   x.newHL = StringFind(q, "new high") >= 0 || StringFind(q, "new low") >= 0; x.rmPrevHL = StringFind(q, "removed the previous") >= 0;
   x.arrivalRaja = x.rmTL && x.rmOppN >= 1;
   x.rajaStrong = x.rmOppN >= 1;
   // Raja v2.1 (A): strong = an opposite zone removed anywhere in the run-out; arrival = the run-out also crossed the trendline by a close
   if(RjA_StrongRun) { x.rajaStrong = x.rmOppMove >= 1; x.arrivalRaja = x.rmTL && x.rmOppMove >= 1; }
   if(RjA_ArrDepart && tf == CTF)
     {
      x.rjaTL = RjA_TLCrossIn(-d, MathMin(bb, L - 5), L);
      x.arrivalRaja = x.rjaTL && (RjA_StrongRun ? x.rmOppMove : x.rmOppN) >= 1;
     }
   //--- F13 ATH and F20 origin: long scans, once per zone (cached by id)
   int ci = DnaCacheFind(x.key);
   double leftLv = 0;
   if(ci >= 0) { x.ath = dcAth[ci]; x.originOk = dcOrig[ci]; leftLv = dcLeft[ci]; }
   else
     {
      int nx = MathMax(L - 5, 1);
      int ex = d > 0 ? SHighest(_Symbol, tf, MODE_HIGH, L - nx + 1, nx) : SLowest(_Symbol, tf, MODE_LOW, L - nx + 1, nx);
      double legX = ex >= 0 ? DnaExt(tf, d, ex) : 0;
      int cnt = MathMin(InpATHBars, nb - B - 2);
      x.ath = false;
      if(cnt > 0 && ex >= 0)
        {
         int e2 = d > 0 ? SHighest(_Symbol, tf, MODE_HIGH, cnt, B + 1) : SLowest(_Symbol, tf, MODE_LOW, cnt, B + 1);
         if(e2 >= 0) x.ath = d > 0 ? legX > SH(_Symbol, tf, e2) : legX < SL(_Symbol, tf, e2);
        }
      x.originOk = -1;
      int lim = MathMin(B + InpOriginBars, nb - 3);
      int cin = 0, cout = 0;
      for(int j = B + 1; j <= lim; j++)
        {
         if(!z.cont && cin < 2 && cout < 2)
           {
            if(d > 0 ? SL(_Symbol, tf, j) > z.prox : SH(_Symbol, tf, j) < z.prox) cin++;
            else if(d > 0 ? SL(_Symbol, tf, j) < z.dist : SH(_Symbol, tf, j) > z.dist) cout++;
           }
         if(!DnaFrac(tf, j, -d)) continue;                            // older opposite level: swing high above a demand, swing low below a supply
         double lv = d > 0 ? SH(_Symbol, tf, j) : SL(_Symbol, tf, j);
         if(d * (lv - z.prox) > 0 && (leftLv == 0 || d * (lv - leftLv) < 0)) leftLv = lv;
        }
      if(!z.cont) x.originOk = (cout >= 2 && cin < 2) ? 0 : 1;
      DnaCacheAdd(x.key, x.ath, x.originOk, leftLv);
     }
   x.leftOppR = leftLv != 0 ? MathMax(0.0, (d * (leftLv - z.prox) - spr) / risk) : -1;
   //--- F17 nested in a fresh same-side ITF / HTF / Higher+1 zone (the HTF first), inside an opposite HtfOf zone
   double zlo = MathMin(z.prox, z.dist), zhi = MathMax(z.prox, z.dist);
   x.nested = false; x.nestTf = PERIOD_CURRENT; x.inOppHtf = false; x.oppHtfTf = PERIOD_CURRENT;
   if(gDirOk)
     {
      int ord[3]; ord[0] = drH; ord[1] = drP; ord[2] = drI;
      for(int o = 0; o < 3 && !x.nested; o++)
        {
         int r = ord[o];
         if(r < 0 || r >= drN || !drRow[r].ok || drRow[r].tf <= tf) continue;
         for(int j = ArraySize(drZ) - 1; j >= 0; j--)
           {
            if(drZRow[j] != r || drZ[j].dir != d || !DirFreshAt(drRow[r].tf, drZ[j])) continue;
            double hlo = MathMin(drZ[j].prox, drZ[j].dist), hhi = MathMax(drZ[j].prox, drZ[j].dist);
            double hh = hhi - hlo;
            double tol = InpNestTolH * hh;
            if(MathMax(zlo, hlo - tol) > MathMin(zhi, hhi + tol)) continue;
            x.nested = true; x.nestTf = drRow[r].tf; x.nestLo = hlo; x.nestHi = hhi;
            x.nestPos = hh > 0 ? d * (z.prox - drZ[j].dist) / hh : 0;
            break;
           }
        }
     }
   if(tf == CTF)
      for(int j = 0; j < ArraySize(dnHz); j++)
        {
         if(dnHz[j].removed || dnHz[j].dir == d) continue;
         double lo2 = MathMin(dnHz[j].prox, dnHz[j].dist), hi2 = MathMax(dnHz[j].prox, dnHz[j].dist);
         if(MathMax(zlo, lo2) > MathMin(zhi, hi2)) continue;
         x.inOppHtf = true; x.oppHtfTf = HtfOf(CTF); break;
        }
   //--- F18 curve
   ENUM_TIMEFRAMES ht = HtfOf(tf);
   x.curve = ht > 0 ? Curve(_Symbol, ht, z.prox) : 50;
   x.curveRaja = gDirOk && gCurveRaja;
   x.curveZone = x.curveRaja ? DirCurveAt(z.prox) : x.curve;
   x.curveBucket = x.curveZone <= 25 ? "L" : (x.curveZone <= 50 ? "LM" : (x.curveZone < 75 ? "HM" : "H"));
   //--- F19 room: nearest opposing zone of this TF (v1 research opp_R) and of the ITF / HTF rows
   double opp = 0;
   for(int j = 0; j < nz; j++)
     {
      if(zs[j].dir == d || zs[j].removed) continue;
      if(d > 0 && zs[j].prox > z.prox && (opp == 0 || zs[j].prox < opp)) opp = zs[j].prox;
      if(d < 0 && zs[j].prox < z.prox && (opp == 0 || zs[j].prox > opp)) opp = zs[j].prox;
     }
   x.hasOpp = opp > 0;
   x.oppR = x.hasOpp ? MathMax(0.0, (d * (opp - z.prox) - spr - RjC_TpOff()) / risk) : 0;
   double oh = 0;
   if(gDirOk)
      for(int j = 0; j < ArraySize(drZ); j++)
        {
         int r = drZRow[j];
         if((r != drI && r != drH) || r < 0 || drZ[j].dir == d || !DirFreshAt(drRow[r].tf, drZ[j])) continue;
         if(d * (drZ[j].prox - z.prox) <= 0) continue;
         if(oh == 0 || d * (drZ[j].prox - oh) < 0) oh = drZ[j].prox;
        }
   x.hasOppHtf = oh > 0;
   x.oppHtfR = x.hasOppHtf ? MathMax(0.0, (d * (oh - z.prox) - spr - RjC_TpOff()) / risk) : 0;
   x.roomR = 99;                                                     // 99 = no opposing level in view ("open")
   if(x.hasOpp) x.roomR = x.oppR;
   if(x.hasOppHtf) x.roomR = MathMin(x.roomR, x.oppHtfR);
   //--- F11 / WOW zone to zone: the move removed an opposite zone and a next opposite zone exists (RJ-B version 1)
   x.wowZ = x.rmOppMove >= 1 && x.hasOpp;
   x.wowPx = x.wowZ ? opp : 0;
   if(!x.wowZ && gWow1 > 0 && d * (gWow1 - z.prox) > 0) x.wowPx = gWow1;   // else the trendline ladder (InpShowWOW)
   x.wowPips = x.wowPx > 0 ? MathAbs(x.wowPx - z.prox) / pip : 0;
   //--- F21-F23
   x.emotional = false;
   for(int j = L; j <= B; j++) if(Emotional(_Symbol, tf, j)) x.emotional = true;
   int aEnd = x.touch1Bar >= 0 ? x.touch1Bar + 1 : 1;
   x.noviceN = 0;
   for(int j = aEnd; j < aEnd + 10 && j < x.runoutBar; j++) if(Rng(_Symbol, tf, j) >= 2 * A1) x.noviceN++;
   x.heightAtr = h / A; x.heightPts = h / _Point; x.heightPips = h / pip;
   double hs[]; int nh = 0;
   for(int j = 0; j < nz; j++) if(!zs[j].removed) { ArrayResize(hs, nh + 1); hs[nh] = MathAbs(zs[j].prox - zs[j].dist); nh++; }
   double medH = 0;
   if(nh > 0) { ArraySort(hs); medH = hs[nh / 2]; }
   x.heightVsMed = medH > 0 ? h / medH : 1;
   x.tooSmall = TooSmall(zs, i);
   datetime tMade = ST(_Symbol, tf, sa) + DnaTfSec(tf);              // known when the stay-away candle closes
   MqlDateTime md; ZeroMemory(md);
   TimeToStruct(tMade, md);
   int hg0 = ((md.hour - InpResearchGMT) % 24 + 24) % 24;
   x.session = hg0 < 7 ? "Asia" : (hg0 < 12 ? "London" : (hg0 < 16 ? "LonNY" : (hg0 < 21 ? "NewYork" : "Late")));
   x.hour = md.hour; x.weekday = md.day_of_week;
   x.minFromOpen = DnaMinFromOpen(x.touch1Bar >= 0 ? ST(_Symbol, tf, x.touch1Bar) : TimeCurrent());
   //--- F24 context
   x.trap = z.trap > 0; x.crowded = z.crowded;
   x.crossNeeded = tf == CTF ? CrossNeeded(d, z.prox) : 0;
   x.nearTl = tf == CTF && NearTrendline(d, z.prox) != "";
   x.overext = tf == CTF && Overextended(d, z.prox);
   x.cpRun = 0;
   for(int j = i; j >= 0; j--) { if(zs[j].dir != d || !zs[j].cont) break; x.cpRun++; }
   int hsd = 0;
   if(gDirOk && drH >= 0 && drRow[drH].ok) hsd = drRow[drH].T != 0 ? drRow[drH].T : drRow[drH].S;
   else if(ht > 0) hsd = HtfTrend(_Symbol, ht);
   x.impulse = hsd == d;
   x.stacked = false;
   for(int j = 0; j < nz; j++)
     {
      if(j == i || zs[j].dir != d || zs[j].removed) continue;
      double gp = d * (z.dist - zs[j].prox);                         // >= 0: the other zone's proximal sits just beyond this distal
      if(gp >= 0 && gp <= 0.5 * h) { x.stacked = true; break; }
     }
   RjA_DnaExtra(tf, zs, i, x);                                       // Raja v2.1 (A): line distance / touches, P vs CP, did its job, next to an opposite HTF zone
   //--- F25 weak types (Raja RJ-B)
   int tTouch = x.touch1Bar >= 0 ? x.touch1Bar : 0;
   bool swingBase = false;
   for(int j = L; j <= B && !swingBase; j++) if(DnaAdv(tf, d, j) == z.dist && DnaFrac(tf, j, d)) swingBase = true;
   x.inherit = false;
   if(swingBase && ((RjA_ArrDepart && tf == CTF) ? x.rjaTL : x.rmTL) && (RjA_StrongRun ? x.rmOppMove : x.rmOppN) == 0)   // Raja v2.1 (A) switches; off = v2.00
      for(int j = i + 1; j < nz; j++)
         if(zs[j].dir == d && zs[j].legBar < L && zs[j].saBar > tTouch && DnaRmOpp(zs, j, zs[j].legBar - 5) >= 1) { x.inherit = true; break; }
   x.overlap = false; x.flip = false;
   for(int j = 0; j < nz; j++)
     {
      if(zs[j].dir == d || zs[j].legBar <= L) continue;              // older opposite zones only
      double lo2 = MathMin(zs[j].prox, zs[j].dist), hi2 = MathMax(zs[j].prox, zs[j].dist);
      if(MathMax(zlo, lo2) > MathMin(zhi, hi2))
        {
         // Raja v2.1 (A): a zone formed right next to a live opposite zone (no gap) is an overlap zone too (L52)
         if(RjA_Adjacent && (!zs[j].removed || zs[j].removedBar < B) && MathMax(zlo, lo2) - MathMin(zhi, hi2) <= 0.1 * h) { x.overlap = true; x.rjaAdj = true; }
         continue;
        }
      if(!zs[j].removed || zs[j].removedBar < B) x.overlap = true;  // still live when this base formed: formed inside it
      else if(!RjA_FlipTL || tf != CTF || RjA_TLCrossIn(-d, B, 1000000)) x.flip = true;   // removed before this base: polarity flip (Raja v2.1 A: only after a trendline cross)
     }
   x.outTl = false;
   if(gDirOk && drH >= 0 && x.nTests == 0 && !z.removed)
     {
      datetime tf0 = ST(_Symbol, tf, sa);
      for(int j = 0; j < ArraySize(drTL); j++)
         if(drTLRow[j] == drH && drTL[j].dir == d && drTLX[j] >= 0 && ST(_Symbol, drRow[drH].tf, drTLX[j]) > tf0) { x.outTl = true; break; }
     }
   x.rajaLive = z.removed && DirRajaRemoved(tf, z) < 0;
   //--- F26 Raja type
   x.rajaCode = x.arrivalRaja ? RT_ARR : ((x.wowZ && x.wowPips > 0) ? RT_WOW : (x.rajaStrong ? RT_STR : (x.overlap ? RT_OVL : (x.inherit ? RT_INH
                : (x.flip ? RT_FLP : (x.outTl ? RT_OTL : (x.nTests >= 1 ? RT_TST : RT_WK)))))));
   x.rajaType = DnaTypeName(x.rajaCode);
   //--- F27 approach (Seiden arrival): from the run-out extreme to the touch (or to now, provisional)
   x.apprProv = x.touch1Bar < 0;
   x.apprBars = MathMax(0, x.runoutBar - tTouch);
   x.apprSpd = x.apprBars > 0 ? MathAbs(x.runoutPx - z.prox) / (A1 * x.apprBars) : 0;
   x.newOppWay = 0;
   for(int j = 0; j < nz; j++) if(zs[j].dir == -d && zs[j].saBar < x.runoutBar && zs[j].saBar >= tTouch) x.newOppWay++;
   int nbase = 0;
   for(int j = MathMax(tTouch, 1); j < MathMax(tTouch, 1) + 10 && j < x.runoutBar; j++) if(Basing(_Symbol, tf, j)) nbase++;
   x.stair = nbase >= 4;
   //--- F28 Direction snapshot
   x.dir = gDirOk ? gDir : 0; x.dirq = gDirOk ? gDirQ : 0;
   int ds = gDirOk ? gDirSide : 0;
   x.align = ds == d ? 1 : (ds == -d ? -1 : 0);
   x.stE = gTFState[0]; x.stI = gTFState[1]; x.stH = gTFState[2]; x.stP = gTFState[3];
   x.planRR = 0; x.stopAtr = 0;
   x.ok = true;
  }

// confirmation TF (spec 2.1 last column; the higher of the two)
ENUM_TIMEFRAMES LensConfTF(ENUM_TIMEFRAMES tf)
  {
   ENUM_TIMEFRAMES b = DirStd(tf);
   switch(b)
     {
      case PERIOD_M5:  return PERIOD_M1;
      case PERIOD_M15: return PERIOD_M5;
      case PERIOD_H1:  return PERIOD_M15;
      case PERIOD_H4:  return PERIOD_H1;
      case PERIOD_D1:  return PERIOD_H4;
      case PERIOD_W1:  return PERIOD_D1;
      case PERIOD_MN1: return PERIOD_W1;
      default: break;
     }
   if(VIsTF(tf)) return PERIOD_MN1;
   return PERIOD_CURRENT;
  }

// ---- Raja v2.1 (A) ----
// Raja's touch allowance per TF for a tested, live zone (x.nTests earlier touches): H1 and below - the 2nd tap often breaks
// it (confirmation only with HTF pressure, else skip); H4 and MN - touches 2-3 confirmation, the 4th usually breaks;
// D1 / W1 - 2nd confirmation, 3rd risky, 4th skip
void RjA_RajaTouch(ZoneDNA &x, string &txt, int &tm)
  {
   int tc = RjA_TfClass(x.tf), nx = x.nTests + 1;
   if(tc == 3 || tc == 1)
     {
      if(x.nTests <= 2) { txt = StringFormat("touch %d: needs confirmation (%s zones hold 3-4 taps)", nx, tc == 3 ? "MN" : "H4"); tm = 2; }
      else { txt = StringFormat("touch %d: the 4th usually breaks - skip", nx); tm = 0; }
     }
   else if(tc == 2)
     {
      if(x.nTests == 1) { txt = "2nd touch: needs confirmation"; tm = 2; }
      else if(x.nTests == 2) { txt = "3rd touch: risky, needs confirmation"; tm = 2; }
      else { txt = StringFormat("touch %d: skip", nx); tm = 0; }
     }
   else
     {
      bool press = x.nested || x.impulse;                             // HTF pressure behind the zone
      if(x.nTests == 1 && press) { txt = "2nd touch: H1 zones often break here - needs confirmation"; tm = 2; }
      else if(x.nTests == 1) { txt = "2nd touch: no HTF pressure, H1 zones break on the 2nd tap - skip"; tm = 0; }
      else { txt = StringFormat("touch %d: skip", nx); tm = 0; }
     }
  }
// Raja lens notes of the v2.1 (A) rules; returns the Raja score change
int RjA_LensNotes(ZoneDNA &x, string &rn)
  {
   int adj = 0;
   if(RjA_TLTouch && x.rjaLineT >= 3)
      rn += x.rjaLineT >= 4 ? StringFormat("trendline touched %d times: weak, likely breaks; ", x.rjaLineT) : "trendline touched 3 times: the 4th touch likely breaks it; ";
   if(RjA_NearLine && x.rjaLineDist >= 0)
     {
      if(x.rjaNearest) { rn += "nearest zone to the trendline: preferred; "; adj++; }
      if(x.rjaLineDist > RjA_FarPips) { rn += StringFormat("%.0f pips from the trendline: often breaks when price comes to the line; ", x.rjaLineDist); adj--; }
     }
   if(RjA_Adjacent && x.rjaAdj) rn += "formed right next to an opposite zone (no gap): overlap, confirmation only; ";
   if(RjA_Lens8)
     {
      if(x.cpRun >= 3) rn += StringFormat("CP x%d in a row: do not trade the next one (it reverses); ", x.cpRun);
      if(x.rjaPCP == -1) rn += "a P sits right next to this CP (no gap): prefer the P; ";
      else if(x.rjaPCP == 1) rn += "CP right next to this P (no gap): the P is preferred; ";
      else if(x.rjaPCP == 2) rn += "CP formed with a gap from the P: use the CP; ";
      if(x.rjaDidJob) rn += "already did its job (reached " + DoubleToString(x.rjaJobPx, _Digits) + " before coming back): tapped once, breaks on the 2nd visit - confirmation only; ";
     }
   if(RjA_OppHtfVeto && x.rjaNextOppHtf && (x.rajaCode == RT_ARR || x.rajaCode == RT_WOW || x.rajaCode == RT_STR))
      rn += "strong zone next to an opposite HTF zone: no trade (it gets removed); ";
   return adj;
  }
// Raja lens vetoes of the v2.1 (A) rules
void RjA_LensVeto(ZoneDNA &x, bool strong, LensOut &o)
  {
   if(RjA_OppHtfVeto && strong && x.rjaNextOppHtf) { o.passR = false; o.emR = 0; }
   if(RjA_Lens8 && x.cpRun >= 3) { o.passR = false; o.emR = 0; }
   if(RjA_Lens8 && x.rjaDidJob && !x.removed) { o.passR = false; if(o.emR == 1) o.emR = 2; }   // no set & forget: confirmation only
  }

// the four mentor lenses and the consensus for one zone (spec 4). kVer / kGrade / np / nm / nc = the v1 ZoneNotes result.
void LensRun(ZoneDNA &x, string kVer, string kGrade, int np, int nm, int nc, LensOut &o)
  {
   ZeroMemory(o);
   o.ok = false;
   if(!x.ok) return;
   int d = x.d;
   bool fresh = x.nTests == 0 && !x.removed;
   //--- Kevin: exactly the v1 verdict; the score is only a mapping for the consensus
   o.kVer = kVer; o.kGrade = kGrade; o.kNP = np; o.kNM = nm; o.kNC = nc;
   string chk = nc > 0 ? "WEAK" : (((np >= 5 && nm <= 1) || x.arrival) ? "STRONG" : "OK");   // the v1 rule, re-derived (assert)
   o.kAssert = chk == kVer;
   o.kVoid = x.depthMax > 75;
   string kp = "", km = "";
   int xp = 0, xm = 0;
   if(o.kVoid) { km += StringFormat("- void: wick %.0f%% deep (VL:1643); ", x.depthMax); xm++; }
   if(x.retNext) { km += "- returned within 2 candles of the stay-away (ZS:450); "; xm++; }
   if(x.cpRun >= 3) { km += StringFormat("- CP x%d in a row: do not chase (AUD #34); ", x.cpRun); xm++; }
   if(x.hasOppHtf && (!x.hasOpp || x.oppHtfR < x.oppR)) { km += "- opposing HTF zone inside the target path: take profit sooner; "; xm++; }
   if(x.ath) { kp += "+ all-time high / low qualifier (KM-22); "; xp++; }
   if(x.nested && x.nestPos >= 0.5) { kp += "+ at the HTF proximal: stop can sit 50% into the HTF zone (ZS:505); "; xp++; }
   o.kPlus = kp; o.kMinus = km;
   int sk = 50 + 8 * np - 10 * nm - 35 * nc;
   if(kVer == "STRONG") sk += 10;
   if(kGrade == "A") sk += 10;
   if(InpKevinPlus) sk += 8 * xp - 10 * xm;
   o.scoreK = (int)MathMax(0, MathMin(100, sk));
   o.passK = kVer != "WEAK" && (kGrade == "A" || kGrade == "B") && (!InpKevinPlus || !o.kVoid);
   o.emK = !o.passK ? 0 : ((gDirOk && gDirQ == 2 && gDirSide == d) ? 1 : 2);
   //--- Seiden: 10-point odds-enhancer sheet
   o.sDep = x.departure >= 2 ? 2 : (x.departure == 1 ? 1 : 0);
   o.vetoS = x.roomR < 3;
   o.sMar = o.vetoS ? 0 : (x.runoutH >= 3 ? 2 : 1);
   bool nearOpp = x.inOppHtf || (x.hasOppHtf && x.oppHtfR < 3);
   o.sBig = gLensD1 == 0 ? 1 : (gLensD1 == d ? (nearOpp ? 1 : 2) : 0);
   if(InpSeidenDepth == 1) o.sTst = x.nTests == 0 ? 2 : (x.depthMax < 25 ? 1 : 0);
   else o.sTst = x.nTests == 0 ? 2 : (x.nTests == 1 ? 1 : 0);
   o.sTim = x.baseRel <= 1.0 ? 1 : 0;
   o.sArr = (x.newOppWay == 0 && !x.stair) ? 1 : 0;
   o.sArrProv = x.apprProv;
   o.scoreS = o.sDep + o.sMar + o.sBig + o.sTst + o.sTim + o.sArr;
   o.golden = x.nTests >= 1 && x.minFromOpen >= 0 && x.minFromOpen <= 60;
   o.passS = !o.vetoS && o.scoreS >= 8;
   o.emS = o.vetoS ? 0 : (o.scoreS >= 9 ? 1 : (o.scoreS == 8 ? 2 : 0));
   string sn = "";
   if(o.vetoS) sn += "no trade < 3:1; ";
   if(x.stacked) sn += "+ levels on top of levels; ";
   bool goodCurve = d > 0 ? x.curveZone <= 50 : x.curveZone >= 50;
   if(x.flip && x.roomR >= 3 && x.departure >= 2 && goodCurve) sn += "flip valid (p.334); ";
   o.sNote = sn;
   //--- Raja: zone types, touch allowance, curve, impulse, margin
   bool strong = x.rajaCode == RT_ARR || x.rajaCode == RT_WOW || x.rajaCode == RT_STR;
   int tfc = x.tf >= PERIOD_MN1 ? 2 : (x.tf >= PERIOD_D1 ? 1 : 0);   // 2 = MN1 / 3M+, 1 = D1 / W1, 0 = H4 and below
   int tm = 0;
   if(x.removed) { o.rTouch = "removed"; tm = 0; }
   else if(fresh) { o.rTouch = "fresh"; tm = 1; }
   else if(tfc == 2) { if(x.nTests <= 2) { o.rTouch = StringFormat("touch %d: confirmation", x.nTests + 1); tm = 2; } else { o.rTouch = "4th touch: expect a break"; tm = 0; } }
   else if(tfc == 1) { if(x.nTests == 1) { o.rTouch = "2nd touch: confirmation"; tm = 2; } else if(x.nTests == 2) { o.rTouch = "3rd touch: risky, confirmation only"; tm = 2; } else { o.rTouch = "4th touch: skip"; tm = 0; } }
   else { if(x.nTests == 1) { o.rTouch = "2nd touch: confirmation"; tm = 2; } else { o.rTouch = "3rd touch: skip"; tm = 0; } }
   if(RjA_TouchTF && !x.removed && !fresh) { string rjT = o.rTouch; RjA_RajaTouch(x, rjT, tm); o.rTouch = rjT; }   // Raja v2.1 (A): per-TF touch allowance
   double cz = x.curveZone;
   bool cRight = d > 0 ? cz <= InpCurveLow : cz >= InpCurveHigh;
   bool cWrong = d > 0 ? cz >= InpCurveHigh : cz <= InpCurveLow;
   o.rCurve = cRight ? (d > 0 ? "low-curve" : "high-curve") : (cWrong ? "wrong-curve" : "mid-curve");
   string rn = "";
   if(!cRight && !cWrong) rn += (d > 0 && cz >= 45 && cz <= 55) ? "50% line buy area; " : "middle of the curve: confirmation only; ";
   if(cWrong) rn += d > 0 ? "demand in the high curve: sells only there; " : "supply in the low curve: buys only there; ";
   if(x.tf < PERIOD_D1 && !x.impulse) rn += "correction side: short-term only / confirmation; ";
   if(x.roomR < 2) rn += "margin < 2x: skip (1x = sideways); "; else if(x.roomR < 3) rn += "margin 2x: acceptable; ";
   if(x.rajaLive) rn += "Raja: still live (1 close only); ";
   int rjAdj = RjA_LensNotes(x, rn);                                 // Raja v2.1 (A): notes + score change (0 with the switches off)
   o.rNote = rn;
   int sr = (x.rajaCode == RT_ARR || x.rajaCode == RT_WOW) ? 4 : (x.rajaCode == RT_STR ? 3 : 0);
   sr += fresh ? 2 : ((x.nTests == 1 && !x.removed) ? 1 : 0);
   sr += cRight ? 2 : (cWrong ? 0 : 1);
   sr += x.roomR >= 3 ? 2 : (x.roomR >= 2 ? 1 : 0);
   o.scoreR = MathMin(10, sr);
   o.passR = strong && fresh && !cWrong && x.roomR >= 2 && (x.tf >= PERIOD_D1 || x.impulse);
   o.emR = (strong && fresh) ? 1 : (tm == 0 ? 0 : 2);
   if(rjAdj != 0) o.scoreR = (int)MathMax(0, MathMin(10, sr + rjAdj));
   RjA_LensVeto(x, strong, o);                                       // Raja v2.1 (A): no-trade / confirmation-only cases (none with the switches off)
   // ---- Raja v2.1 (B) ---- never trade sideways (L8): the zone's TF (or also the Direction HTF) is stuck in a range
   if(InpRjBChop)
     {
      bool rjbSw = RjB_Sideways(x.tf);
      if(!rjbSw && InpRjBChopTF == 1 && gDirOk && drH >= 0 && drH < drN && drRow[drH].ok) rjbSw = RjB_Sideways(drRow[drH].tf);
      if(rjbSw) { o.passR = false; o.emR = 0; o.rNote += "sideways (swings overlap, no new HH-HL / LL-LH): never trade; "; }
     }
   //--- Baker: speed out, speed in, fresh, time in zone, don't trade into supply / demand
   o.bOut = x.departure;
   o.bIn = x.leginSpd >= 1.0 ? 2 : (x.leginSpd >= 0.6 ? 1 : 0);
   o.bFresh = fresh ? 3 : 0;
   if(x.originOk == 0) o.bFresh -= 2;
   if(!x.cont) o.bTime = x.k <= 2 ? 2 : (x.k <= 3 ? 1 : 0);
   else o.bTime = (x.k >= 3 && x.k <= 6) ? 2 : (x.k <= 2 ? 1 : 0);
   o.vetoB = x.inOppHtf || (x.tf < PERIOD_D1 ? x.roomR < 3 : x.roomR < 5);
   o.scoreB = (int)MathMax(0, MathMin(10, o.bOut + o.bIn + o.bFresh + o.bTime));
   o.passB = o.scoreB >= 7 && !o.vetoB && fresh;
   o.bDeep = x.dist + d * 0.25 * x.h;                                // near the distal, inside the zone
   bool withTrend = (gDirOk && gDirSide != 0) ? gDirSide == d : gLensD1 == d;
   o.emB = !o.passB ? 0 : (withTrend ? 2 : (o.scoreB >= 8 ? 3 : 0));
   string bn = "";
   if(!fresh) bn += "not fresh: veto; ";
   if(x.originOk == 0) bn += "the base retested older price (-2); ";
   if(x.inOppHtf) bn += "inside an opposite HTF zone: do not trade into it; ";
   else if(o.vetoB) bn += StringFormat("room %.1fR < %d:1; ", x.roomR, x.tf < PERIOD_D1 ? 3 : 5);
   if(o.passB && !withTrend && o.scoreB < 8) bn += "against the trend: strong zones only (8+); ";
   o.bNote = bn;
   //--- consensus (InpW* weights) and verdict
   double wk = LensW(0), ws = LensW(1), wr = LensW(2), wb = LensW(3), sw = wk + ws + wr + wb;   // InpW* (or the calibrated W rows)
   o.cons = sw > 0 ? (wk * o.scoreK + ws * 10.0 * o.scoreS + wr * 10.0 * o.scoreR + wb * 10.0 * o.scoreB) / sw : 0;
   o.nPass = (o.passK ? 1 : 0) + (o.passS ? 1 : 0) + (o.passR ? 1 : 0) + (o.passB ? 1 : 0);
   if(nc > 0 || o.vetoS || o.vetoB) { o.vcode = 0; o.verdict = "X"; }
   else if(o.nPass == 4 && o.cons >= 75) { o.vcode = 4; o.verdict = "A+"; }
   else if(o.nPass >= 3 && o.passK) { o.vcode = 3; o.verdict = "A"; }
   else if(o.nPass >= 2) { o.vcode = 2; o.verdict = "B"; }
   else { o.vcode = 1; o.verdict = "C"; }
   //--- conflicts (spec 4.5), one line each
   string cf = "";
   if(x.nTests == 1 && x.depthMax <= 25) cf += StringFormat("Seiden: 2nd touch OK (%d pt, depth %.0f%%) | Kevin: tested -> skip | Raja: confirmation only\n", o.sTst, x.depthMax);
   if(x.depthMax > 75) cf += StringFormat("Kevin: void (wick %.0f%% deep) | Seiden late rule: done | Baker: not fresh\n", x.depthMax);
   if(x.cont) cf += "Kevin: CP 'most powerful' | Seiden: mid-move base is not quality (p.94)\n";
   if(x.align < 0 && x.nested) cf += "Seiden: OK at fresh HTF level | Kevin: half risk / skip | Baker: strong zones only, deep entry\n";
   if(x.stacked) cf += "Seiden: +1 (two vault doors) | Kevin: ~50/50\n";
   if(x.gapAway) cf += "Seiden/Baker: strongest departure | Kevin: no zone there\n";
   if(!x.chain && o.scoreS >= 9) cf += StringFormat("Kevin: not in the chain (hidden by default) | Seiden %d/10\n", o.scoreS);
   if(x.rajaLive) cf += "v1: removed (1 close) | Raja: needs 2nd big close\n";
   o.conf = cf;
   o.ok = true;
  }

//+------------------------------------------------------------------+
//| v2 merge overlap (spec 5.4): runs on v1's selection. Same-side   |
//| drawn zones overlapping by more than InpMergeMinPct of the       |
//| smaller height: mode 1 keeps the older (outer) zone, mode 2 the  |
//| one nearer price. The merged one is hidden through V2Hide, which |
//| can free a slot for the next-nearest zone (so it ships off).     |
//+------------------------------------------------------------------+
// the chart zones DrawZones(Z, false) would draw now (same filters and order), returns the count
int V2MergeSelect(double px, int &sel[])
  {
   ArrayResize(sel, 0);
   int idx[]; double dst[]; int n = 0;
   for(int i = 0; i < ArraySize(Z); i++)
     {
      if(Z[i].legBar > InpMaxZoneAge) continue;
      if(Z[i].removed && !InpShowRemoved) continue;
      if(Z[i].tested && RjA_HideTested(CTF, Z[i])) continue;          // = !InpShowTested unless RjA_ShowTested (Raja v2.1 A)
      if(RjC_OnlyQual() && !Z[i].chain && !Z[i].removed) continue;
      if(TooSmall(Z, i)) continue;
      if(V2Hide(Z[i])) continue;
      ArrayResize(idx, n + 1); ArrayResize(dst, n + 1);
      idx[n] = i; dst[n] = MathMin(MathAbs(Z[i].prox - px), MathAbs(Z[i].dist - px)); n++;
     }
   int ns = 0;
   for(int pick = 0; pick < MathMin(InpMaxZones, n); pick++)
     {
      int best = -1;
      for(int j = 0; j < n; j++) if(idx[j] >= 0 && (best < 0 || dst[j] < dst[best])) best = j;
      if(best < 0) break;
      ArrayResize(sel, ns + 1); sel[ns] = idx[best]; ns++;
      idx[best] = -1;
     }
   return ns;
  }
void V2MergePrepare()
  {
   ArrayResize(gMgL, 0); ArrayResize(gMgD, 0); ArrayResize(gMgKeep, 0); ArrayResize(gMgDrop, 0);
   if(InpMergeOverlap <= 0) return;
   double px = Mid();
   for(int it = 0; it < 20; it++)
     {
      int sel[];
      int ns = V2MergeSelect(px, sel);
      int drop = -1, keep = -1;
      for(int a = 0; a < ns && drop < 0; a++)
         for(int b = a + 1; b < ns && drop < 0; b++)
           {
            int ia = sel[a], ib = sel[b];
            if(Z[ia].dir != Z[ib].dir) continue;
            double loA = MathMin(Z[ia].prox, Z[ia].dist), hiA = MathMax(Z[ia].prox, Z[ia].dist);
            double loB = MathMin(Z[ib].prox, Z[ib].dist), hiB = MathMax(Z[ib].prox, Z[ib].dist);
            double ov = MathMin(hiA, hiB) - MathMax(loA, loB), sm = MathMin(hiA - loA, hiB - loB);
            if(sm <= 0 || ov <= InpMergeMinPct / 100.0 * sm) continue;
            bool keepA = true;
            if(InpMergeOverlap == 1) keepA = Z[ia].legBar >= Z[ib].legBar;   // the older zone = the origin
            else keepA = MathMin(MathAbs(Z[ia].prox - px), MathAbs(Z[ia].dist - px)) <= MathMin(MathAbs(Z[ib].prox - px), MathAbs(Z[ib].dist - px));
            keep = keepA ? ia : ib; drop = keepA ? ib : ia;
           }
      if(drop < 0) break;
      int n = ArraySize(gMgL);
      ArrayResize(gMgL, n + 1); ArrayResize(gMgD, n + 1); ArrayResize(gMgKeep, n + 1); ArrayResize(gMgDrop, n + 1);
      gMgL[n] = Z[drop].legBar; gMgD[n] = Z[drop].dir; gMgKeep[n] = keep; gMgDrop[n] = drop;
     }
  }

//+------------------------------------------------------------------+
//| v2 M5: research context. A research pass runs the Direction      |
//| engine and DnaPrepare for its own timeframe; the chart's         |
//| Direction state is saved first and given back afterwards, so the |
//| chart (box, alerts, DNA) never sees the research timeframe.      |
//+------------------------------------------------------------------+
DirRow   dsRow[DMAXROW];
int      dsN = 0, dsE = -1, dsI = -1, dsH = -1, dsP = -1;
Zone     dsZ[]; int dsZRow[];
TLine    dsTL[]; int dsTLRow[], dsTLX[];
bool     dsDirOk = false, dsRealign = false, dsCurveOk = false, dsCurveRaja = false, dsWowPend = false;
int      dsDir = 0, dsDirQ = 0, dsSide = 0, dsBlocked = 0, dsLockSide = 0, dsWowN = 0, dsLensD1 = 0;
string   dsHead = "";
string   dsTxt[4], dsWowTxt[4];
int      dsTFState[5];
double   dsCurve = 50, dsCurvePd = 0, dsCurvePs = 0, dsRangeLo = 0, dsRangeHi = 0, dsLockLo = 0, dsLockHi = 0, dsWow1 = 0, dsWow2 = 0;
double   dsWowPx[4];
ENUM_TIMEFRAMES dsLockTF = PERIOD_CURRENT;
Zone     dsHz[];

void DirStateSave()
  {
   for(int r = 0; r < DMAXROW; r++) dsRow[r] = drRow[r];
   dsN = drN; dsE = drE; dsI = drI; dsH = drH; dsP = drP;
   int n = ArraySize(drZ);
   ArrayResize(dsZ, n); ArrayResize(dsZRow, n);
   for(int i = 0; i < n; i++) { dsZ[i] = drZ[i]; dsZRow[i] = drZRow[i]; }
   n = ArraySize(drTL);
   ArrayResize(dsTL, n); ArrayResize(dsTLRow, n); ArrayResize(dsTLX, n);
   for(int i = 0; i < n; i++) { dsTL[i] = drTL[i]; dsTLRow[i] = drTLRow[i]; dsTLX[i] = drTLX[i]; }
   dsDirOk = gDirOk; dsDir = gDir; dsDirQ = gDirQ; dsSide = gDirSide; dsBlocked = gDirBlocked; dsRealign = gDirRealign; dsHead = gDirHead;
   for(int k = 0; k < 4; k++) { dsTxt[k] = gDirTxt[k]; dsWowTxt[k] = gWowTxt[k]; dsWowPx[k] = gWowPx[k]; }
   for(int k = 0; k < 5; k++) dsTFState[k] = gTFState[k];
   dsCurveOk = gCurveOk; dsCurveRaja = gCurveRaja; dsCurve = gCurve; dsCurvePd = gCurvePd; dsCurvePs = gCurvePs; dsRangeLo = gRangeLo; dsRangeHi = gRangeHi;
   dsLockSide = gLockSide; dsLockLo = gLockLo; dsLockHi = gLockHi; dsLockTF = gLockTF;
   dsWow1 = gWow1; dsWow2 = gWow2; dsWowPend = gWowPend; dsWowN = gWowN;
   n = ArraySize(dnHz);
   ArrayResize(dsHz, n);
   for(int i = 0; i < n; i++) dsHz[i] = dnHz[i];
   dsLensD1 = gLensD1;
  }
void DirStateRestore()
  {
   for(int r = 0; r < DMAXROW; r++) drRow[r] = dsRow[r];
   drN = dsN; drE = dsE; drI = dsI; drH = dsH; drP = dsP;
   int n = ArraySize(dsZ);
   ArrayResize(drZ, n); ArrayResize(drZRow, n);
   for(int i = 0; i < n; i++) { drZ[i] = dsZ[i]; drZRow[i] = dsZRow[i]; }
   n = ArraySize(dsTL);
   ArrayResize(drTL, n); ArrayResize(drTLRow, n); ArrayResize(drTLX, n);
   for(int i = 0; i < n; i++) { drTL[i] = dsTL[i]; drTLRow[i] = dsTLRow[i]; drTLX[i] = dsTLX[i]; }
   gDirOk = dsDirOk; gDir = dsDir; gDirQ = dsDirQ; gDirSide = dsSide; gDirBlocked = dsBlocked; gDirRealign = dsRealign; gDirHead = dsHead;
   for(int k = 0; k < 4; k++) { gDirTxt[k] = dsTxt[k]; gWowTxt[k] = dsWowTxt[k]; gWowPx[k] = dsWowPx[k]; }
   for(int k = 0; k < 5; k++) gTFState[k] = dsTFState[k];
   gCurveOk = dsCurveOk; gCurveRaja = dsCurveRaja; gCurve = dsCurve; gCurvePd = dsCurvePd; gCurvePs = dsCurvePs; gRangeLo = dsRangeLo; gRangeHi = dsRangeHi;
   gLockSide = dsLockSide; gLockLo = dsLockLo; gLockHi = dsLockHi; gLockTF = dsLockTF;
   gWow1 = dsWow1; gWow2 = dsWow2; gWowPend = dsWowPend; gWowN = dsWowN;
   n = ArraySize(dsHz);
   ArrayResize(dnHz, n);
   for(int i = 0; i < n; i++) dnHz[i] = dsHz[i];
   gLensD1 = dsLensD1;
  }

//+------------------------------------------------------------------+
//| v2 M6: calibration table RFX_Calib.csv (spec 6.3), written by    |
//| tools/zone_research/analyze.py --calibrate. Rows:                |
//|  cell  ver,stop_model,level,key,n,touched,p1..p5,p_opp,mfe_med,  |
//|        E1,E2,E3,E5,Eopp,bestT,bestE,ci_lo,ci_hi (raw cell rates;  |
//|        p / E / mfe per touch-1 trade, touched per zone)          |
//|  W,<lens>,<weight>   LR,<feature>,<coef>,<mean>,<sd>             |
//|  LR,_intercept,<b>   B,<feature>,<lo>,<hi>,n,p3,E3               |
//|  CS,<lo>-<hi>,n,E_best,bestT   META,...                          |
//| Lookup: key from the zone's current DNA, levels L0 -> L5 while   |
//| the cell has n >= InpCalMinN, each level shrunk toward the one   |
//| above it: v = (w x cell + a x parent) / (w + a), a = InpCalPrior,|
//| w = trades (zones for "touched"). No level with enough data ->   |
//| the CS row of the zone's consensus bin ("prior").                |
//| Host inputs: InpCalFile, InpCalCommon, InpCalMinN, InpCalPrior,  |
//| InpUseCalWeights. The same arithmetic is in analyze.py           |
//| (cal_lookup), which the report's reliability table uses.         |
//+------------------------------------------------------------------+
struct CalOut
  {
   bool     ok, prior, model;
   int      level, n, nt, bestT;      // bestT 1..5 = R, 0 = the opposing zone
   double   touched, bestE, ciLo, ciHi, mfeMed, pModel;
   double   p[6];                     // p1..p5, p_opp (shrunk)
   double   e[5];                     // E1, E2, E3, E5, Eopp per touch-1 trade (shrunk)
   string   key, tells, csBin;
  };
string   calKey[]; int calLvl[], calN[];
double   calTch[], calMfe[], calLo[], calHi[];
double   calP[];                      // 6 per cell
double   calE[];                      // 5 per cell
int      calCount = 0;
string   calBF[]; double calBLo[], calBHi[], calBP3[], calBE3[]; int calBN[];
string   calLF[]; double calLC[], calLM[], calLS[];
double   calLB = 0;
bool     calLOk = false;
string   calCsTxt[]; double calCsLo[], calCsHi[], calCsE[]; int calCsN[], calCsT[];
double   gCalW[4];
bool     gCalWOk = false, gCalOk = false, gCalCommonUsed = true, gCalNoted = false;
long     gCalMod = -2;
string   gCalMeta = "", gCalStop = "";
int      gCalBad = 0;

// consensus weight of lens m (0 Kevin, 1 Seiden, 2 Raja, 3 Baker): the inputs, or the W rows with InpUseCalWeights
double LensW(int m)
  {
   if(InpUseCalWeights && gCalWOk && m >= 0 && m < 4) return MathMax(0.0, gCalW[m]);
   return MathMax(0.0, m == 0 ? InpWKevin : (m == 1 ? InpWSeiden : (m == 2 ? InpWRaja : InpWBaker)));
  }
string CalSg(double v) { return (v >= 0 ? "+" : "") + DoubleToString(v, 2); }
string CalSym() { string u = _Symbol; StringReplace(u, ",", " "); StringReplace(u, "\n", " "); StringReplace(u, "\r", " "); StringReplace(u, "\"", "'"); return u; }   // as the research CSV writes it
int    CalLens(string v) { string u = v; StringToLower(u); return u == "kevin" ? 0 : (u == "seiden" ? 1 : (u == "raja" ? 2 : (u == "baker" ? 3 : -1))); }
int    CalTCode(string v) { string u = v; StringTrimLeft(u); StringTrimRight(u); StringToLower(u); if(u == "opp") return 0; return (int)StringToInteger(u); }
void CalClear()
  {
   ArrayResize(calKey, 0); ArrayResize(calLvl, 0); ArrayResize(calN, 0); ArrayResize(calTch, 0); ArrayResize(calMfe, 0);
   ArrayResize(calLo, 0); ArrayResize(calHi, 0); ArrayResize(calP, 0); ArrayResize(calE, 0);
   ArrayResize(calBF, 0); ArrayResize(calBLo, 0); ArrayResize(calBHi, 0); ArrayResize(calBP3, 0); ArrayResize(calBE3, 0); ArrayResize(calBN, 0);
   ArrayResize(calLF, 0); ArrayResize(calLC, 0); ArrayResize(calLM, 0); ArrayResize(calLS, 0);
   ArrayResize(calCsTxt, 0); ArrayResize(calCsLo, 0); ArrayResize(calCsHi, 0); ArrayResize(calCsE, 0); ArrayResize(calCsN, 0); ArrayResize(calCsT, 0);
   calCount = 0; calLB = 0; calLOk = false; gCalOk = false; gCalWOk = false; gCalMeta = ""; gCalStop = ""; gCalBad = 0;
   for(int m = 0; m < 4; m++) gCalW[m] = 0;
  }
// read the file (InpCalCommon: Common\Files first, else MQL5\Files first; the other folder is the fallback)
bool CalLoad()
  {
   CalClear();
   bool common = InpCalCommon;
   if(!FileIsExist(InpCalFile, common ? FILE_COMMON : 0)) common = !common;
   int h = FileOpen(InpCalFile, FILE_READ | FILE_TXT | FILE_ANSI | FILE_SHARE_READ | FILE_SHARE_WRITE | (common ? FILE_COMMON : 0));
   if(h == INVALID_HANDLE) return false;
   gCalCommonUsed = common;
   bool anyW = false;
   while(!FileIsEnding(h))
     {
      string ln = FileReadString(h);
      StringTrimLeft(ln); StringTrimRight(ln);
      if(ln == "") continue;
      string f[];
      int nf = StringSplit(ln, ',', f);
      if(nf < 2) { gCalBad++; continue; }
      string k0 = f[0];
      if(k0 == "ver") continue;                                       // header line
      if(k0 == "META") { gCalMeta = ln; continue; }
      if(k0 == "W")
        {
         int m = nf >= 3 ? CalLens(f[1]) : -1;
         if(m < 0) { gCalBad++; continue; }
         gCalW[m] = StringToDouble(f[2]); anyW = true;
         continue;
        }
      if(k0 == "B")
        {
         if(nf < 7) { gCalBad++; continue; }
         int nb = ArraySize(calBN);
         ArrayResize(calBF, nb + 1); ArrayResize(calBLo, nb + 1); ArrayResize(calBHi, nb + 1); ArrayResize(calBN, nb + 1); ArrayResize(calBP3, nb + 1); ArrayResize(calBE3, nb + 1);
         calBF[nb] = f[1]; calBLo[nb] = StringToDouble(f[2]); calBHi[nb] = StringToDouble(f[3]); calBN[nb] = (int)StringToInteger(f[4]);
         calBP3[nb] = StringToDouble(f[5]); calBE3[nb] = StringToDouble(f[6]);
         continue;
        }
      if(k0 == "LR")
        {
         if(nf >= 3 && f[1] == "_intercept") { calLB = StringToDouble(f[2]); calLOk = true; continue; }
         if(nf < 5 || StringToDouble(f[4]) <= 0) { gCalBad++; continue; }
         int nl = ArraySize(calLF);
         ArrayResize(calLF, nl + 1); ArrayResize(calLC, nl + 1); ArrayResize(calLM, nl + 1); ArrayResize(calLS, nl + 1);
         calLF[nl] = f[1]; calLC[nl] = StringToDouble(f[2]); calLM[nl] = StringToDouble(f[3]); calLS[nl] = StringToDouble(f[4]);
         continue;
        }
      if(k0 == "CS")
        {
         string bb[];
         if(nf < 5 || StringSplit(f[1], '-', bb) != 2) { gCalBad++; continue; }
         int nc = ArraySize(calCsN);
         ArrayResize(calCsTxt, nc + 1); ArrayResize(calCsLo, nc + 1); ArrayResize(calCsHi, nc + 1); ArrayResize(calCsN, nc + 1); ArrayResize(calCsE, nc + 1); ArrayResize(calCsT, nc + 1);
         calCsTxt[nc] = f[1]; calCsLo[nc] = StringToDouble(bb[0]); calCsHi[nc] = StringToDouble(bb[1]);
         calCsN[nc] = (int)StringToInteger(f[2]); calCsE[nc] = StringToDouble(f[3]); calCsT[nc] = CalTCode(f[4]);
         continue;
        }
      // a cell row: the first field is the format version (2)
      if(nf < 22 || StringToInteger(k0) <= 0) { gCalBad++; continue; }
      int lv = (int)StringToInteger(f[2]), n = (int)StringToInteger(f[4]);
      if(lv < 0 || lv > 5 || n <= 0 || f[3] == "") { gCalBad++; continue; }
      int c = calCount;
      ArrayResize(calKey, c + 1, 1000); ArrayResize(calLvl, c + 1, 1000); ArrayResize(calN, c + 1, 1000); ArrayResize(calTch, c + 1, 1000);
      ArrayResize(calMfe, c + 1, 1000); ArrayResize(calLo, c + 1, 1000); ArrayResize(calHi, c + 1, 1000);
      ArrayResize(calP, (c + 1) * 6, 6000); ArrayResize(calE, (c + 1) * 5, 5000);
      calKey[c] = f[3]; calLvl[c] = lv; calN[c] = n; calTch[c] = StringToDouble(f[5]);
      for(int j = 0; j < 6; j++) calP[c * 6 + j] = StringToDouble(f[6 + j]);
      calMfe[c] = StringToDouble(f[12]);
      for(int j = 0; j < 5; j++) calE[c * 5 + j] = StringToDouble(f[13 + j]);
      calLo[c] = StringToDouble(f[20]); calHi[c] = StringToDouble(f[21]);
      gCalStop = f[1];
      calCount++;
     }
   FileClose(h);
   gCalWOk = anyW && (gCalW[0] + gCalW[1] + gCalW[2] + gCalW[3]) > 0;
   gCalOk = calCount > 0 || ArraySize(calCsN) > 0;
   Print("ZoneVision v2: calibration ", InpCalFile, " (", common ? "Common\\Files" : "MQL5\\Files", "): ", calCount, " cells, ", ArraySize(calCsN), " prior rows, weights ",
         gCalWOk ? "yes" : "no", ", model ", calLOk ? "yes" : "no", ", ", gCalBad, " malformed rows skipped");
   return gCalOk;
  }
// every 60 s (and at start): reload when the file's modify time changes; true = the loaded table changed
bool CalCheck()
  {
   long t1 = FileIsExist(InpCalFile, InpCalCommon ? FILE_COMMON : 0) ? FileGetInteger(InpCalFile, FILE_MODIFY_DATE, InpCalCommon) : -1;
   long t2 = (t1 < 0 && FileIsExist(InpCalFile, InpCalCommon ? 0 : FILE_COMMON)) ? FileGetInteger(InpCalFile, FILE_MODIFY_DATE, !InpCalCommon) : -1;
   long mt = t1 >= 0 ? 2 * t1 : (t2 >= 0 ? 2 * t2 + 1 : -1);          // the folder is part of the stamp
   if(mt == gCalMod) return false;
   gCalMod = mt;
   if(mt < 0)
     {
      bool had = gCalOk;
      CalClear();
      if(had || !gCalNoted) Print("ZoneVision v2: no calibration file ", InpCalFile, " in Common\\Files or MQL5\\Files (History: no data)");
      gCalNoted = true;
      return had;
     }
   CalLoad();
   return true;
  }
string CalPat(ZoneDNA &x) { return x.d > 0 ? (x.cont ? "RBR" : "DBR") : (x.cont ? "DBD" : "RBD"); }
string CalRt(int code) { return code == RT_ARR ? "ARR" : (code == RT_WOW ? "WOW" : (code == RT_STR ? "STR" : "weak")); }
// the hierarchical keys L0..L5 (spec 6.3; analyze.py builds the same strings from the s1_ snapshot)
void CalKeys(ZoneDNA &x, string &k[])
  {
   ArrayResize(k, 6);
   k[0] = "all";
   k[1] = "tf=" + TfName(x.tf);
   k[2] = k[1] + "|pat=" + CalPat(x) + "|al=" + IntegerToString(x.align);
   k[3] = k[2] + "|rt=" + CalRt(x.rajaCode) + "|ne=" + (x.nested ? "1" : "0");
   k[4] = k[3] + "|dg=" + x.depthGrade + "|cz=" + x.curveBucket;
   k[5] = k[4] + "|sym=" + CalSym();
  }
int CalFind(int lv, string key) { for(int i = 0; i < calCount; i++) if(calLvl[i] == lv && calKey[i] == key) return i; return -1; }
double CalShr(double v, double w, double par, double a) { return (w + a) > 0 ? (w * v + a * par) / (w + a) : par; }
double CalClip(double v, double lo, double hi) { return MathMax(lo, MathMin(hi, v)); }
// feature values for the LR / B rows (same names and clipping as analyze.py FEATURES); false = unknown feature
bool CalFeat(string f, ZoneDNA &x, LensOut &o, double &v)
  {
   v = 0;
   if(f == "departure") v = x.departure;
   else if(f == "base_n") v = x.baseN;
   else if(f == "base_rel") v = x.baseRel;
   else if(f == "legin_spd") v = x.leginSpd;
   else if(f == "legout_rel") v = x.legoutRel;
   else if(f == "legout_atr") v = x.legoutAtr;
   else if(f == "leg_ratio") v = x.legRatio;
   else if(f == "gap") v = x.gap;
   else if(f == "gap_away") v = x.gapAway ? 1 : 0;
   else if(f == "runout_h") v = CalClip(x.runoutH, 0, 20);
   else if(f == "rm_opp_n") v = x.rmOppN;
   else if(f == "arrival_raja") v = x.arrivalRaja ? 1 : 0;
   else if(f == "ath") v = x.ath ? 1 : 0;
   else if(f == "nested") v = x.nested ? 1 : 0;
   else if(f == "nest_pos") v = x.nested ? x.nestPos : 0;
   else if(f == "curve_zone") v = CalClip(x.curveZone, -50, 150);
   else if(f == "room_R") v = CalClip(x.roomR, 0, 10);
   else if(f == "opp_R") v = CalClip(x.oppR, 0, 10);
   else if(f == "opp_htf_R") v = CalClip(x.oppHtfR, 0, 10);
   else if(f == "depth_1") v = x.depth1;
   else if(f == "depth_max") v = x.depthMax;
   else if(f == "n_tests") v = x.nTests;
   else if(f == "align_dir") v = x.align;
   else if(f == "dirq") v = x.dirq;
   else if(f == "impulse") v = x.impulse ? 1 : 0;
   else if(f == "cp_run") v = x.cpRun;
   else if(f == "origin_ok") v = x.originOk;
   else if(f == "golden") v = (x.minFromOpen >= 0 && x.minFromOpen <= 60) ? 1 : 0;
   else if(f == "height_atr") v = x.heightAtr;
   else if(f == "stacked") v = x.stacked ? 1 : 0;
   else if(f == "trap") v = x.trap ? 1 : 0;
   else if(f == "crowded") v = x.crowded ? 1 : 0;
   else if(f == "cons") { if(!o.ok) return false; v = o.cons; }
   else if(f == "sK") { if(!o.ok) return false; v = o.scoreK; }
   else if(f == "sS") { if(!o.ok) return false; v = o.scoreS; }
   else if(f == "sR") { if(!o.ok) return false; v = o.scoreR; }
   else if(f == "sB") { if(!o.ok) return false; v = o.scoreB; }
   else if(f == "n_pass") { if(!o.ok) return false; v = o.nPass; }
   else return false;
   return true;
  }
string CalRange(double lo, double hi)
  {
   if(lo <= -1e8) return "< " + DoubleToString(hi, 2);
   if(hi >= 1e8) return ">= " + DoubleToString(lo, 2);
   return DoubleToString(lo, 2) + "-" + DoubleToString(hi, 2);
  }
// the calibrated history of one zone (false = no table, or no cell and no prior row)
bool CalLookup(ZoneDNA &x, LensOut &o, CalOut &c)
  {
   ZeroMemory(c);
   c.ok = false; c.prior = false; c.model = false; c.level = -1; c.bestT = 0; c.key = ""; c.tells = ""; c.csBin = "";
   if(!gCalOk || !x.ok) return false;
   string k[];
   CalKeys(x, k);
   double a = MathMax(0.0, InpCalPrior), tch = 0, mfe = 0;
   double pp[6], ee[5];
   ArrayInitialize(pp, 0); ArrayInitialize(ee, 0);
   int last = -1;
   for(int lv = 0; lv <= 5; lv++)
     {
      int ci = CalFind(lv, k[lv]);
      if(ci < 0 || calN[ci] < MathMax(1, InpCalMinN)) break;          // cells only get smaller further down
      double n = calN[ci], nt = MathRound(calN[ci] * calTch[ci]);
      if(lv == 0)
        {
         tch = calTch[ci]; mfe = calMfe[ci];
         for(int j = 0; j < 6; j++) pp[j] = calP[ci * 6 + j];
         for(int j = 0; j < 5; j++) ee[j] = calE[ci * 5 + j];
        }
      else
        {
         tch = CalShr(calTch[ci], n, tch, a);
         mfe = CalShr(calMfe[ci], nt, mfe, a);
         for(int j = 0; j < 6; j++) pp[j] = CalShr(calP[ci * 6 + j], nt, pp[j], a);
         for(int j = 0; j < 5; j++) ee[j] = CalShr(calE[ci * 5 + j], nt, ee[j], a);
        }
      last = ci; c.level = lv;
     }
   if(last >= 0)
     {
      c.ok = true; c.key = k[c.level]; c.n = calN[last]; c.nt = (int)MathRound(calN[last] * calTch[last]);
      c.touched = tch; c.mfeMed = mfe;
      for(int j = 0; j < 6; j++) c.p[j] = pp[j];
      for(int j = 0; j < 5; j++) c.e[j] = ee[j];
      int tg[5] = {1, 2, 3, 5, 0};
      c.bestE = ee[0]; c.bestT = 1;
      for(int j = 1; j < 5; j++) if(ee[j] > c.bestE) { c.bestE = ee[j]; c.bestT = tg[j]; }
      c.ciLo = calLo[last]; c.ciHi = calHi[last];
     }
   else
     {
      if(!o.ok) return false;
      for(int b = 0; b < ArraySize(calCsN); b++)
         if(calCsN[b] >= MathMax(1, InpCalMinN) && o.cons >= calCsLo[b] && (o.cons < calCsHi[b] || calCsHi[b] >= 100))
           { c.ok = true; c.prior = true; c.n = calCsN[b]; c.bestE = calCsE[b]; c.bestT = calCsT[b]; c.csBin = calCsTxt[b]; break; }
      if(!c.ok) return false;
     }
   // logistic p(3R): unknown features are left out (the same as sitting at their mean)
   if(calLOk)
     {
      double z = calLB;
      for(int f = 0; f < ArraySize(calLF); f++)
        {
         double v = 0;
         if(!CalFeat(calLF[f], x, o, v)) continue;
         z += calLC[f] * (v - calLM[f]) / calLS[f];
        }
      c.model = true;
      c.pModel = 1.0 / (1.0 + MathExp(-CalClip(z, -30, 30)));
     }
   // tells: the best and the worst single-feature bin this zone falls into (E at 3R)
   int ib = -1, iw = -1;
   for(int b = 0; b < ArraySize(calBN); b++)
     {
      if(calBN[b] < MathMax(1, InpCalMinN)) continue;
      double v = 0;
      if(!CalFeat(calBF[b], x, o, v) || v < calBLo[b] || v >= calBHi[b]) continue;
      if(ib < 0 || calBE3[b] > calBE3[ib]) ib = b;
      if(iw < 0 || calBE3[b] < calBE3[iw]) iw = b;
     }
   if(ib >= 0 && calBE3[ib] > 0) c.tells = "+ " + calBF[ib] + " " + CalRange(calBLo[ib], calBHi[ib]) + " (E3 " + CalSg(calBE3[ib]) + "R, n " + IntegerToString(calBN[ib]) + ")";
   if(iw >= 0 && iw != ib && calBE3[iw] < 0) c.tells += (c.tells == "" ? "" : " | ") + "- " + calBF[iw] + " " + CalRange(calBLo[iw], calBHi[iw]) + " (E3 " + CalSg(calBE3[iw]) + "R, n " + IntegerToString(calBN[iw]) + ")";
   return true;
  }
// probability shown for target t (1..5 = R, 0 = the opposing zone)
double CalP(CalOut &c, int t) { if(t >= 1 && t <= 5) return c.p[t - 1]; return c.p[5]; }
string CalT(int t) { return t == 0 ? "opp" : IntegerToString(t) + "R"; }

//+------------------------------------------------------------------+
//| v2 M10: ZoneBot integration (spec 7)                             |
//|  RFX_CfgHash()  CRC32 over the zone-rule inputs (spec I5); the   |
//|                 bot trades ZoneVision's export only when it      |
//|                 equals its own.                                  |
//|  RFX_GVName()   global-variable names RFX2|sym|tf|k|field (7.2). |
//|  CoreEval(T)    headless run of ZoneVision's Redraw steps for    |
//|                 timeframe T on _Symbol: the same Detect, HTF     |
//|                 lines, bias, Qualify, Direction engine, the      |
//|                 drawn-zone selection (DrawZones' filters with    |
//|                 the v2 location filters / merge off), traps,     |
//|                 ZoneNotes, DNA, lenses and calibration lookup.   |
//|                 Draws nothing (gQuiet). ZoneVision never calls   |
//|                 it; it changes no ZoneVision output.             |
//| Host contract (adds): InpBiasSource, InpShowTested,              |
//| InpShowRemoved, InpOnlyQualified, InpMaxZones.                   |
//+------------------------------------------------------------------+
uint RFX_Crc32(string s)
  {
   uchar b[];
   int n = MathMin(StringLen(s), StringToCharArray(s, b));
   uint crc = (uint)0xFFFFFFFF;
   for(int i = 0; i < n; i++)
     {
      crc ^= (uint)b[i];
      for(int k = 0; k < 8; k++) crc = (crc & 1) != 0 ? ((crc >> 1) ^ (uint)0xEDB88320) : (crc >> 1);
     }
   return ~crc;
  }
// the zone-rule inputs as one text (spec I5, both programs have them under the same names)
string RFX_CfgText()
  {
   return StringFormat("%.4f|%d|%.4f|%.4f|%d|%d|%.4f|%.4f|%d|%d|%d", InpMinLegRatio, InpMaxBase, InpMaxZoneATR, InpEmoATR, InpLookback, InpMaxZoneAge,
                       InpMinGap, InpMinSizeVsMedian, InpTLSwing, InpTLHistory, InpTLBias ? 1 : 0)
          + (RjA_RmMode != 0 ? "|rm" + IntegerToString(RjA_RmMode) : "");   // Raja v2.1 (A): close-only removal changes the zones (default: text unchanged)
  }
uint   RFX_CfgHash() { return RFX_Crc32(RFX_CfgText()); }
string RFX_GVName(string sym, string tf, string k, string f) { return "RFX2|" + sym + "|" + tf + "|" + k + "|" + f; }
string RFX_GVPrefix(string sym, string tf) { return "RFX2|" + sym + "|" + tf + "|"; }
// ladder index of a TF for the nest field: M1 0 ... MN 7, 3M 8, 6M 9, 12M 10 (-1 = other)
int    RFX_TfIndex(ENUM_TIMEFRAMES tf)
  {
   ENUM_TIMEFRAMES lad[8] = {PERIOD_M1, PERIOD_M5, PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1, PERIOD_MN1};
   for(int k = 0; k < 8; k++) if(lad[k] == tf) return k;
   if(VIsTF(tf)) return 8 + VSlot(tf);
   return -1;
  }
int    RFX_KvCode(string v) { return v == "STRONG" ? 2 : (v == "OK" ? 1 : 0); }
int    RFX_KgCode(string g) { return g == "A" ? 0 : (g == "B" ? 1 : 2); }
int    RFX_EmCode(LensOut &o) { return o.ok ? o.emK * 1000 + o.emS * 100 + o.emR * 10 + o.emB : 0; }

// CoreEval output: the zones ZoneVision draws on T, nearest first, with their notes, plan, DNA, lenses and history
int      ceN = 0;
ENUM_TIMEFRAMES ceTF = PERIOD_CURRENT;
datetime ceAt = 0;                   // bar-0 time of T at the evaluation
Zone     ceZ[];
datetime ceBase[];                   // base-start time (the zone id of spec 7.2)
string   ceVer[], ceGrade[];
int      ceNP[], ceNM[], ceNC[];      // ZoneNotes strength / minus / deal-breaker counts
double   ceEn[], ceSl[], ceTp[], ceRR[];
ZoneDNA  ceDna[];
LensOut  ceLens[];
CalOut   ceCal[];
void CoreEvalClear()
  {
   ceN = 0;
   ArrayResize(ceZ, 0); ArrayResize(ceBase, 0); ArrayResize(ceVer, 0); ArrayResize(ceGrade, 0);
   ArrayResize(ceEn, 0); ArrayResize(ceSl, 0); ArrayResize(ceTp, 0); ArrayResize(ceRR, 0);
   ArrayResize(ceDna, 0); ArrayResize(ceLens, 0); ArrayResize(ceCal, 0);
   ArrayResize(ceNP, 0); ArrayResize(ceNM, 0); ArrayResize(ceNC, 0);
  }
bool CoreEval(ENUM_TIMEFRAMES T)
  {
   CoreEvalClear();
   ceTF = T; ceAt = 0;
   if(T == PERIOD_CURRENT || VIsTF(T) || SBars(_Symbol, T) < 50) return false;
   CTF = T;
   if(ATR(T, 1) <= 0) return false;                                  // ATR not ready yet: no data this time
   bool keepQuiet = gQuiet;
   gQuiet = true;
   ceAt = ST(_Symbol, T, 0);
   // Redraw(): bias, zones, HTF lines, chart lines, chain, Direction
   ENUM_TIMEFRAMES h0 = HtfOf(CTF);
   gTrend = h0 > 0 ? HtfTrend(_Symbol, h0) : 0;
   Detect(_Symbol, CTF, Z, false);
   gHTF = PERIOD_CURRENT; gHUpOn = false; gHDnOn = false; gHBias = 0; gHBiasTxt = "";
   if(h0 > 0)
     {
      gTF = h0; Trendlines(_Symbol, h0); TLBias();
      gHTF = h0; gHUpOn = gUpOn; gHUpS = gUpS; gHUpP = gUpP; gHUpW = gUpW; gHUpB = gUpB; gHDnOn = gDnOn; gHDnS = gDnS; gHDnP = gDnP; gHDnW = gDnW; gHDnB = gDnB;
      RjA_HUpT = RjA_UpT; RjA_HDnT = RjA_DnT;                         // Raja v2.1 (A)
     }
   if(InpTLBias && gHBias != 0) gTrend = gHBias;
   gTF = CTF;
   Trendlines(_Symbol, CTF);
   Qualify();
   DirRun();
   if(InpBiasSource == 1 && gDirOk) gTrend = gDir;
   // DrawZones(Z, false): the closest eligible zones, trap worked out for each picked zone, then ZoneNotes
   double px = Mid();
   int idx[]; double dst[]; int n = 0;
   for(int i = 0; i < ArraySize(Z); i++)
     {
      if(Z[i].legBar > InpMaxZoneAge) continue;
      if(Z[i].removed && !InpShowRemoved) continue;
      if(Z[i].tested && !InpShowTested) continue;
      if(InpOnlyQualified && !Z[i].chain && !Z[i].removed) continue;
      if(TooSmall(Z, i)) continue;
      ArrayResize(idx, n + 1); ArrayResize(dst, n + 1);
      idx[n] = i; dst[n] = MathMin(MathAbs(Z[i].prox - px), MathAbs(Z[i].dist - px)); n++;
     }
   int pickZi[]; int np = 0;
   for(int pick = 0; pick < MathMin(InpMaxZones, n); pick++)
     {
      int best = -1;
      for(int j = 0; j < n; j++) if(idx[j] >= 0 && (best < 0 || dst[j] < dst[best])) best = j;
      if(best < 0) break;
      int zi = idx[best]; idx[best] = -1;
      if(!Z[zi].removed && Z[zi].trapBar == -1)
        {
         int tb = -1; bool cr = false;
         Z[zi].trap = FindTrap(_Symbol, CTF, Z[zi].dir, Z[zi].prox, Z[zi].dist, Z[zi].saBar, Z[zi].baseEnd, tb, cr);
         Z[zi].trapBar = tb == -1 ? -2 : tb; Z[zi].crowded = cr;
        }
      string ver = "", why = "";
      ZoneNotes(Z, zi, ver, why);
      ArrayResize(pickZi, np + 1); ArrayResize(ceVer, np + 1); ArrayResize(ceGrade, np + 1);
      ArrayResize(ceEn, np + 1); ArrayResize(ceSl, np + 1); ArrayResize(ceTp, np + 1); ArrayResize(ceRR, np + 1);
      ArrayResize(ceDna, np + 1); ArrayResize(ceLens, np + 1); ArrayResize(ceCal, np + 1);
      ArrayResize(ceZ, np + 1); ArrayResize(ceBase, np + 1); ArrayResize(ceNP, np + 1); ArrayResize(ceNM, np + 1); ArrayResize(ceNC, np + 1);
      pickZi[np] = zi; ceVer[np] = ver; ceGrade[np] = gNGrade;
      ceEn[np] = gNEn; ceSl[np] = gNSl; ceTp[np] = gNTp; ceRR[np] = gNRR;
      ZeroMemory(ceDna[np]); ZeroMemory(ceLens[np]); ZeroMemory(ceCal[np]);
      ceNP[np] = gNP; ceNM[np] = gNM; ceNC[np] = gNC;
      np++;
     }
   // V2Zones(): DNA + lenses + history for every picked zone (after all traps are set, as on the chart)
   if(InpDNA) DnaPrepare();
   for(int k = 0; k < np; k++)
     {
      int zi = pickZi[k];
      ceBase[k] = ST(_Symbol, CTF, Z[zi].legBar + Z[zi].baseN);
      if(!InpDNA) continue;
      DnaCompute(CTF, Z, zi, ceDna[k]);
      if(!ceDna[k].ok) continue;
      ceDna[k].planRR = ceRR[k];
      ceDna[k].stopAtr = (ceDna[k].A1 > 0 && ceEn[k] > 0) ? MathAbs(ceEn[k] - ceSl[k]) / ceDna[k].A1 : 0;
      if(InpLenses) LensRun(ceDna[k], ceVer[k], ceGrade[k], ceNP[k], ceNM[k], ceNC[k], ceLens[k]);
      if(gCalOk) CalLookup(ceDna[k], ceLens[k], ceCal[k]);
     }
   for(int k = 0; k < np; k++) ceZ[k] = Z[pickZi[k]];
   ceN = np;
   gQuiet = keepQuiet;
   return true;
  }
// the CoreEval zone with this side and base-start time (-1 = ZoneVision does not draw it)
int CoreFind(int d, datetime tBase)
  {
   for(int k = 0; k < ceN; k++) if(ceZ[k].dir == d && ceBase[k] == tBase) return k;
   return -1;
  }

// ==== RFX_ARRIVAL_ENGINE BEGIN ====
//+------------------------------------------------------------------+
//| RFX arrival engine 1.0 (owner-approved Raja / Kevin rules, Oct   |
//| 2026). SHARED VERBATIM by RFX_ZoneCore.mqh (MT5 ZoneVision +     |
//| ZoneBot), RamanFX_ZoneVision.mq4 and RamanFX_ZoneBot.mq4 - edit  |
//| it in RFX_ZoneCore.mqh and run `node scripts/sync-arrival-mql.mjs`|
//| (src/core/toolsArrival.test.ts fails when the copies differ).    |
//| Compiles as MQL4 and MQL5: series are copied into arrays, so it  |
//| never depends on ArraySetAsSeries / CopyRates differences.       |
//| A line-by-line mirror of the canonical TypeScript:               |
//|   supabase/functions/telegram-bot/zvTrend.ts  (zvPivots,         |
//|     zvFitAnchor, zvLines, zvMomentum, zvTouches, zvAtr)          |
//|   supabase/functions/telegram-bot/zonecore.ts (Series, detect)   |
//|   supabase/functions/telegram-bot/arrival.ts  (arrivals,         |
//|     arrivalTf, stopOf, rrOf, CONFIRM_TF, HIGHER_TF)              |
//| Same names (zvX kept; detect -> zcDetect, arrivals ->            |
//| arrArrivals, arrivalTf -> arrArrivalTf, stopOf -> arrStopOf,     |
//| rrOf -> arrRrOf); "TS n" comments = the line in that file.       |
//| Index convention = the TS Series = MQL series: shift 0 = a       |
//| PHANTOM bar at the price (o = h = l = c = price), 1 = the newest |
//| CLOSED bar, larger = older. Conformance: tools/telegram_bot/     |
//| parity/mql_port.py (a mechanical Python port of this block) must |
//| reproduce tools/telegram_bot/parity/arrival_fixtures.json.       |
//+------------------------------------------------------------------+
#define RX_VER    100
#define RX_MAXB   460      // closed bars loaded per TF: detect (200) + the leg-out's older line window (200) + ATR, so
                           // more history never changes a reading
#define RX_Q      129600   // virtual 3M (quarter) in minutes; real TFs are their minutes (M15 15 ... MN 43200)
#define RX_SWING  2        // ZV.swing (InpTLSwing)
#define RX_LOOK   200      // ZV.lookback (InpLookback)
#define RX_FIT_TOL   0.05  // ZV.fitTol: a candle may poke through a line by this x ATR(1) before the anchor moves
#define RX_MIN_SLOPE 0.015 // ZV.minSlope: least |slope| per bar (x ATR at the newer pivot), else too flat
#define RX_MIN_RISE  1.0   // ZV.minRise: least rise / fall between the anchors (x ATR at the newer pivot), else too flat
#define RX_MAXREM 32
#define RX_MAXW   64

// zonecore.ts ZParams; FX_PARAMS = RAJA + base_strict (+ emo_touch, used by tests() only, not here)
struct RxParams { double min_leg_ratio; int max_base; double max_zone_atr; int lookback; int max_zone_age; double emo_atr; int removal_mode; bool base_strict; };
void RxParamsRaja(RxParams &p) { p.min_leg_ratio = 1.2; p.max_base = 6; p.max_zone_atr = 1.5; p.lookback = 200; p.max_zone_age = 200; p.emo_atr = 3.0; p.removal_mode = 1; p.base_strict = false; }
void RxParamsFX(RxParams &p) { RxParamsRaja(p); p.base_strict = true; }

// zonecore.ts class Series (TS 25-50): bars oldest first + a phantom price -> newest-first arrays, MT5 iATR(14)
class RxSer
  {
public:
   int      n, tf;
   double   price;
   bool     virt;          // virtual 3M: zvAtr = Wilder ATR (zvTrend.ts 45-58)
   double   O[], H[], L[], C[], a[], wa[];
   datetime T[];
   // caller: Alloc(nClosed), fill shifts 1..nClosed (O/H/L/C/T), then Finish(price)
   void     Alloc(int nClosed, int tfm) { n = nClosed + 1; tf = tfm; virt = tfm == RX_Q; ArrayResize(O, n); ArrayResize(H, n); ArrayResize(L, n); ArrayResize(C, n); ArrayResize(T, n); ArrayResize(a, n); ArrayResize(wa, n); }
   void     Finish(double p)
     {
      price = p; O[0] = p; H[0] = p; L[0] = p; C[0] = p; T[0] = n > 1 ? T[1] : 0;           // TS 31-33
      double tr[]; ArrayResize(tr, n);
      for(int i = 0; i < n; i++) { tr[i] = 0; a[i] = 0; wa[i] = 0; }
      for(int i = 0; i < n - 1; i++) { double pc = C[i + 1]; tr[i] = MathMax(H[i], pc) - MathMin(L[i], pc); }   // TS 36
      double s = 0;
      for(int i = n - 2; i >= 0; i--)                                                         // TS 40-44
        {
         s += tr[i];
         if(i + 14 <= n - 2) s -= tr[i + 14];
         if(i + 14 <= n - 1) a[i] = s / 14;
        }
      if(virt)                                                                                 // zvTrend.ts 47-56
        {
         double sum = 0; int cnt = 0;
         for(int i = n - 1; i >= 0; i--)
           {
            double t = H[i] - L[i];
            if(i < n - 1) t = MathMax(t, MathMax(MathAbs(H[i] - C[i + 1]), MathAbs(L[i] - C[i + 1])));
            cnt++;
            if(cnt < 14) { sum += t; continue; }
            if(cnt == 14) { sum += t; wa[i] = sum / 14; continue; }
            wa[i] = (wa[i + 1] * 13 + t) / 14;
           }
        }
     }
   double   atr(int i)   { return i >= 0 && i < n ? a[i] : 0; }
   double   zvAtr(int i) { if(!virt) return atr(i); return i >= 0 && i < n ? wa[i] : 0; }
   double   rng(int i)   { return H[i] - L[i]; }
   double   body(int i)  { return MathAbs(C[i] - O[i]); }
   bool     basing(int i) { double r = rng(i); return r > 0 && body(i) / r < 0.5; }
   int      cdir(int i)  { return C[i] > O[i] ? 1 : (C[i] < O[i] ? -1 : 0); }
   bool     emotional(int i, double emo) { double x = atr(i + 1); return x > 0 && rng(i) > emo * x; }
  };
// TS arrival.ts 131: older = bars.slice(0, n - L) -> a Series whose shift i (>= 1) = src shift i + L, phantom = its newest close
void RxSlice(RxSer &src, int L, RxSer &dst)
  {
   dst.Alloc(src.n - 1 - L, src.tf);
   for(int i = 1; i < dst.n; i++) { dst.O[i] = src.O[i + L]; dst.H[i] = src.H[i + L]; dst.L[i] = src.L[i + L]; dst.C[i] = src.C[i + L]; dst.T[i] = src.T[i + L]; }
   dst.Finish(dst.n > 1 ? dst.C[1] : 0);
  }

// ---- zvTrend.ts ----
struct ZvPivot { int bar; double p; int t; };                       // t: -1 real valley, +1 real peak
struct ZvLine  { int dir; int a; int b; double pa; double pb; int cuts; int brokenAt; };   // brokenAt: the candle that closed beyond it (-1 live)
struct ZvResult { bool hasUp; bool hasDn; bool hasMom; bool hasUpX; bool hasDnX; ZvLine up; ZvLine dn; ZvLine mom; ZvLine upX; ZvLine dnX; string whyUp; string whyDn; };
double zvSlope(ZvLine &t) { return (t.pb - t.pa) / MathMax(1, t.a - t.b); }                 // TS 40
double zvAt(ZvLine &t, double j) { return t.pb + zvSlope(t) * (t.b - j); }                    // TS 42

bool RxFrLow(RxSer &S, int i, int sw)  { for(int k = 1; k <= sw; k++) if(i - k < 1 || S.L[i] > S.L[i + k] || S.L[i] >= S.L[i - k]) return false; return true; }   // TS 63
bool RxFrHigh(RxSer &S, int i, int sw) { for(int k = 1; k <= sw; k++) if(i - k < 1 || S.H[i] < S.H[i + k] || S.H[i] <= S.H[i - k]) return false; return true; }  // TS 64
void RxAddPiv(ZvPivot &out[], int b, double p, int t) { int m = ArraySize(out); ArrayResize(out, m + 1); out[m].bar = b; out[m].p = p; out[m].t = t; }
// TS 61-74: real valleys / peaks, oldest first
int zvPivots(RxSer &S, int bars, ZvPivot &out[])
  {
   ArrayResize(out, 0);
   int sw = RX_SWING, fH = -1, fL = -1;
   for(int i = bars; i > sw; i--)
     {
      bool lo = RxFrLow(S, i, sw), hi = RxFrHigh(S, i, sw);
      if(lo && fH > 0) for(int j = i - 1; j >= 1; j--) { if(S.L[j] < S.L[i]) break; if(S.H[j] > S.H[fH]) { RxAddPiv(out, i, S.L[i], -1); break; } }
      if(hi && fL > 0) for(int j = i - 1; j >= 1; j--) { if(S.H[j] > S.H[i]) break; if(S.L[j] < S.L[fL]) { RxAddPiv(out, i, S.H[i], 1); break; } }
      if(lo) fL = i;
      if(hi) fH = i;
     }
   return ArraySize(out);
  }
// TS 79-90: wick re-anchoring - the candle poking furthest through the line (oldest on a tie) becomes the older anchor
int zvFitAnchor(RxSer &S, int A, int b2, double p2, int d)
  {
   double tol = RX_FIT_TOL * S.zvAtr(1);
   int a = A;
   for(int it = 0; it < 50; it++)
     {
      double sl = (p2 - (d > 0 ? S.L[a] : S.H[a])) / (a - b2);
      int worst = -1; double ex = tol;
      for(int j = a - 1; j > b2; j--) { double lv = p2 + sl * (b2 - j), e = d > 0 ? lv - S.L[j] : S.H[j] - lv; if(e > ex) { ex = e; worst = j; } }
      if(worst < 0) return a;
      a = worst;
     }
   return a;
  }
// TS zvPair: the line o (older) -> n (newer), FitAnchor re-anchored (clean anchors); false when in the wrong order or too
// flat (< RX_MIN_SLOPE ATR per bar or < RX_MIN_RISE ATR between the anchors; ATR at the newer pivot)
bool zvPair(RxSer &S, ZvPivot &o, ZvPivot &n, int d, ZvLine &t)
  {
   if(d > 0 ? !(n.p > o.p) : !(n.p < o.p)) return false;
   int a = zvFitAnchor(S, o.bar, n.bar, n.p, d);
   t.dir = d; t.a = a; t.b = n.bar; t.pa = d > 0 ? S.L[a] : S.H[a]; t.pb = n.p; t.cuts = 0; t.brokenAt = -1;
   if(d > 0 ? !(t.pb > t.pa) : !(t.pb < t.pa)) return false;
   double ab = MathMax(S.zvAtr(t.b), 1e-12);
   if(MathAbs(zvSlope(t)) < RX_MIN_SLOPE * ab || MathAbs(t.pb - t.pa) < RX_MIN_RISE * ab) return false;
   return true;
  }
bool RxBeyond(RxSer &S, ZvLine &t, int d, int j) { return d > 0 ? S.C[j] < zvAt(t, j) : S.C[j] > zvAt(t, j); }   // a CLOSE beyond the line
bool RxAbove(int d, double x, double y) { return d > 0 ? x < y : x > y; }                     // further from the line's side
// TS zvLines: the owner's structure state machine per direction (down; up mirrored), in bar order - the TOP (highest
// high wick) is never a pivot; pivot 1 = the first lower real peak after it (one at / above it: structure change);
// pivot 2 = the tangent from pivot 1 over the lower highs since it (FitAnchor, not too flat; the next in tangent order
// otherwise); the line is KEPT until a candle CLOSES beyond it (-> upX / dnX, brokenAt), then the next lower high
// re-anchors from the same pivot 1. + at most one momentum line, only for a direction without a live line.
void zvLines(RxSer &S, ZvResult &res, ZvPivot &piv[])
  {
   res.hasUp = false; res.hasDn = false; res.hasMom = false; res.hasUpX = false; res.hasDnX = false; res.whyUp = "too few bars"; res.whyDn = "too few bars";
   ArrayResize(piv, 0);
   int bars = MathMin(RX_LOOK, S.n - 1 - RX_SWING);
   if(bars <= RX_SWING + 2) return;
   zvPivots(S, bars, piv);
   int np = ArraySize(piv);
   for(int d = 1; d >= -1; d -= 2)
     {
      int want = d > 0 ? -1 : 1, k = 0, extBar = -1, nSeen = 0;
      double extP = 0;
      int seen[];
      ArrayResize(seen, np);
      bool hasP1 = false, hasLive = false, hasBrk = false;
      ZvPivot p1; ZeroMemory(p1);
      ZvLine live, brk; ZeroMemory(live); ZeroMemory(brk);
      string why = d > 0 ? "no real valleys" : "no real peaks";
      for(int j = bars; j >= 1; j--)
        {
         if(hasLive && j < live.b && RxBeyond(S, live, d, j)) { live.brokenAt = j; brk = live; hasBrk = true; hasLive = false; why = "broken at shift " + IntegerToString(j); }
         double xj = d > 0 ? S.L[j] : S.H[j];
         if(extBar < 0 || RxAbove(d, xj, extP))
           {
            if(hasLive) { live.brokenAt = j; brk = live; hasBrk = true; hasLive = false; }
            extBar = j; extP = xj; hasP1 = false; nSeen = 0;
            why = d > 0 ? "no higher low after the bottom" : "no lower high after the top";
           }
         for(; k < np && piv[k].bar >= j; k++)
           {
            if(piv[k].t != want || !RxAbove(d, extP, piv[k].p)) continue;   // at the top's level (the top itself): never a pivot
            if(!hasP1 || !RxAbove(d, p1.p, piv[k].p))
              {
               if(hasLive) { live.brokenAt = piv[k].bar; brk = live; hasBrk = true; hasLive = false; }
               p1 = piv[k]; hasP1 = true; nSeen = 0;
               why = d > 0 ? "one higher low so far" : "one lower high so far";
               continue;
              }
            seen[nSeen++] = k;
            if(hasLive) continue;
            // pivot 2: the tangent order from pivot 1 (flattest first, the newer on a tie), the first valid zvPair
            int tried[]; ArrayResize(tried, nSeen); ArrayInitialize(tried, 0);
            bool got = false; ZvLine t; ZeroMemory(t);
            for(int r = 0; r < nSeen && !got; r++)
              {
               int bi = -1; double bs = 0;
               for(int x = 0; x < nSeen; x++)
                 {
                  if(tried[x] != 0) continue;
                  double s = (piv[seen[x]].p - p1.p) / (p1.bar - piv[seen[x]].bar);
                  if(bi < 0 || (d > 0 ? s < bs : s > bs) || (s == bs && piv[seen[x]].bar < piv[seen[bi]].bar)) { bi = x; bs = s; }
                 }
               tried[bi] = 1;
               got = zvPair(S, p1, piv[seen[bi]], d, t);
              }
            if(!got) { why = "too flat"; continue; }
            int bj = -1;
            for(int x = t.b - 1; x >= j; x--) if(RxBeyond(S, t, d, x)) { bj = x; break; }
            if(bj >= 0) { t.brokenAt = bj; brk = t; hasBrk = true; why = "broken at shift " + IntegerToString(bj); continue; }
            live = t; hasLive = true; why = "ok";
           }
        }
      if(d > 0) { res.hasUp = hasLive; res.up = live; res.hasUpX = hasBrk; res.upX = brk; res.whyUp = why; }
      else      { res.hasDn = hasLive; res.dn = live; res.hasDnX = hasBrk; res.dnX = brk; res.whyDn = why; }
     }
   int bestE = -1;
   for(int d = 1; d >= -1; d -= 2)
     {
      if(d > 0 ? res.hasUp : res.hasDn) continue;
      ZvLine m; ZeroMemory(m); int e = -1;
      if(!zvMomentum(S, piv, bars, d, m, e)) continue;
      if(bestE < 0 || e < bestE) { bestE = e; res.mom = m; res.hasMom = true; }                  // stable sort by e: first on a tie
     }
  }
double RxP(RxSer &S, int d, int j) { return d > 0 ? S.L[j] : S.H[j]; }                         // TS 156: the line's side
double RxQ(RxSer &S, int d, int j) { return d > 0 ? S.H[j] : S.L[j]; }                         // TS 157: the leg's end side
bool   RxMore(int d, double x, double y) { return d > 0 ? x > y : x < y; }                      // TS 158
// TS 155-187: Kevin's MOMENTUM line (red, never a trend line); e = the leg's end E
bool zvMomentum(RxSer &S, ZvPivot &piv[], int bars, int d, ZvLine &out, int &e)
  {
   int lim = MathMin(bars, S.n - 1);
   if(lim < 8) return false;
   int E = 1;
   for(int j = 2; j <= MathMin(5, lim); j++) if(RxMore(d, RxQ(S, d, j), RxQ(S, d, E))) E = j;
   int k = E + 1;
   while(k <= lim && !RxMore(d, RxQ(S, d, k), RxQ(S, d, E))) k++;
   int lastPiv = -1;
   for(int q = ArraySize(piv) - 1; q >= 0; q--) if(piv[q].t == (d > 0 ? -1 : 1)) { lastPiv = q; break; }
   int from = (lastPiv >= 0 && piv[lastPiv].bar < k && piv[lastPiv].bar > E) ? piv[lastPiv].bar : k - 1;
   int A = -1;
   for(int j = E + 1; j <= from; j++) if(A < 0 || RxMore(d, RxP(S, d, A), RxP(S, d, j))) A = j;
   if(A < 0 || A - E < 3) return false;
   double tol = 0.25 * S.zvAtr(1);
   int b = -1; double sl = 0;
   for(int it = 0; it < 10 && A - E >= 3; it++)
     {
      b = -1;
      for(int j = A - 3; j >= 1; j--)
        {
         double s = (RxP(S, d, j) - RxP(S, d, A)) / (A - j);
         if(b < 0 || (d > 0 ? s < sl : s > sl)) { b = j; sl = s; }
        }
      int worst = -1; double ex = tol;
      for(int j = A - 1; j > A - 3; j--) { double x = d > 0 ? RxP(S, d, A) + sl * (A - j) - RxP(S, d, j) : RxP(S, d, j) - RxP(S, d, A) - sl * (A - j); if(x > ex) { ex = x; worst = j; } }
      if(worst < 0) break;
      A = worst; b = -1;
     }
   if(b < 0 || A - E < 3 || d * sl <= 0) return false;
   double pb = RxP(S, d, A) + sl * (A - b), ab = MathMax(S.zvAtr(b), 1e-12);
   if(MathAbs(sl) < 0.015 * ab || MathAbs(sl) * (A - 1) < 1.5 * ab) return false;
   out.dir = d; out.a = A; out.b = b; out.pa = RxP(S, d, A); out.pb = pb; out.cuts = 0; out.brokenAt = -1; e = E;
   return true;
  }
// TS 190-199: separate visits within 0.1 ATR of the line
int zvTouches(RxSer &S, ZvLine &t)
  {
   double tol = 0.1 * S.zvAtr(1);
   int m = 0; bool inT = false;
   for(int j = t.a; j >= 1; j--) { double lv = zvAt(t, j); bool touch = t.dir > 0 ? S.L[j] <= lv + tol : S.H[j] >= lv - tol; if(touch && !inT) m++; inT = touch; }
   return m;
  }

// ---- zonecore.ts detect (TS 66-110) ----
struct RxZone { int dir; double prox; double dist; int legBar; int baseN; int saBar; double legRatio; bool cont; bool tested; int testedBar; bool removed; int removedBar; datetime baseStart; datetime made; datetime tLeg; };
int zcDetect(RxSer &S, RxParams &p, RxZone &out[])
  {
   ArrayResize(out, 0);
   int bars = MathMin(p.lookback, S.n - p.max_base - 3);
   for(int L = bars; L > 1; L--)
     {
      double lr = S.rng(L);
      if(lr <= 0 || S.basing(L)) continue;
      int d = S.cdir(L);
      if(d == 0) continue;
      int k = 0; double maxBase = 0;
      while(k < p.max_base && S.basing(L + 1 + k)) { maxBase = MathMax(maxBase, S.rng(L + 1 + k)); k++; }
      if(k == 0 || maxBase <= 0) continue;
      if(p.base_strict && k == p.max_base && L + 1 + k < S.n && S.basing(L + 1 + k)) continue;
      double ratio = lr / maxBase;
      if(ratio < p.min_leg_ratio) continue;
      bool cont = S.cdir(L + 1 + k) == d;
      double prox, dist;
      if(d > 0)
        {
         prox = -DBL_MAX; double m = DBL_MAX;
         for(int b = L + 1; b <= L + k; b++) { prox = MathMax(prox, MathMax(S.O[b], S.C[b])); m = MathMin(m, S.L[b]); }
         dist = MathMin(m, S.L[L]);
        }
      else
        {
         prox = DBL_MAX; double m = -DBL_MAX;
         for(int b = L + 1; b <= L + k; b++) { prox = MathMin(prox, MathMin(S.O[b], S.C[b])); m = MathMax(m, S.H[b]); }
         dist = MathMax(m, S.H[L]);
        }
      double h = MathAbs(prox - dist), atr = S.atr(L);
      if(h <= 0) continue;
      if(atr > 0 && h > p.max_zone_atr * atr) continue;
      int sa = L - 1;
      if((d > 0 && S.L[sa] <= prox) || (d < 0 && S.H[sa] >= prox)) continue;
      RxZone z;
      z.dir = d; z.prox = prox; z.dist = dist; z.legBar = L; z.baseN = k; z.saBar = sa; z.legRatio = ratio; z.cont = cont; z.tested = false; z.testedBar = -1;
      z.removed = false; z.removedBar = -1; z.baseStart = S.T[L + k]; z.made = S.T[sa]; z.tLeg = S.T[L];
      bool wick = p.removal_mode == 0;
      for(int j = sa - 1; j > 0; j--)
        {
         if(d > 0)
           {
            if(S.C[j] < dist || (wick && S.L[j] < dist && !S.emotional(j, p.emo_atr))) { z.removed = true; z.removedBar = j; break; }
            if(!z.tested && S.L[j] <= prox && !S.emotional(j, p.emo_atr)) { z.tested = true; z.testedBar = j; }
           }
         else
           {
            if(S.C[j] > dist || (wick && S.H[j] > dist && !S.emotional(j, p.emo_atr))) { z.removed = true; z.removedBar = j; break; }
            if(!z.tested && S.H[j] >= prox && !S.emotional(j, p.emo_atr)) { z.tested = true; z.testedBar = j; }
           }
        }
      int m2 = ArraySize(out); ArrayResize(out, m2 + 1); out[m2] = z;
     }
   return ArraySize(out);
  }

// ---- arrival.ts ----
#define RX_SL_ATRFRAC 0.1   // SL.atrFrac
#define RX_SL_HTFBUF  2     // SL.htfBuffers
struct ArrLine { int dir; int a; int b; double pa; double pb; datetime ta; datetime tb; };
struct RxArrival { RxZone zone; ArrLine line; int legs[3]; int nLegs; int crossBar; double crossPx; int rem[RX_MAXREM]; int nRem; bool strong; double valley; };
struct ArrStop { double stop; double buffer; double atr; int basis; double valley; bool hasHost; RxZone host; };   // basis 1 'htf', 0 'valley'
struct RxPlan
  {
   int dir; double entry; double stop; double buffer; double atr; int basis; double valley; bool hasHost; RxZone host; bool hasRR; double rr;
   bool hasCeiling; double ceiling; bool hasLineNow; double lineNow; ArrLine ceilingLine;
   int weak[RX_MAXW]; int nWeak; int realign; int target; bool hasTargetPx; double targetPx; bool hasHtfZone; RxZone htfZone;
   bool hasTp; double tp; bool capped; bool extended;
  };   // weak / realign / target = indices into RxReading.zones (-1 = none)
struct RxConfirm { RxZone zone; int arr; bool hasTarget; double target; bool inArea; double entry; double stop; double buffer; double atr; int basis; bool hasRR; double rr; };   // arr = index into RxReading.larr

double RxLo(RxZone &z) { return MathMin(z.prox, z.dist); }
double RxHi(RxZone &z) { return MathMax(z.prox, z.dist); }
double RxGap(double v, RxZone &z) { return v < RxLo(z) ? RxLo(z) - v : (v > RxHi(z) ? v - RxHi(z) : 0); }   // TS 97

// TS 66-69: confirmation TF / next higher TF (minutes; 0 = none)
int RxConfirmTf(int m) { if(m == 60 || m == 240) return 15; if(m == 1440) return 60; if(m == 10080) return 240; if(m == 43200) return 1440; if(m == RX_Q) return 10080; return 0; }
int RxHigherTf(int m)  { if(m == 15) return 60; if(m == 60) return 240; if(m == 240) return 1440; if(m == 1440) return 10080; if(m == 10080) return 43200; if(m == 43200) return RX_Q; return 0; }
string RxTfName(int m)
  {
   if(m == RX_Q) return "3M";
   if(m == 1) return "M1"; if(m == 5) return "M5"; if(m == 15) return "M15"; if(m == 30) return "M30"; if(m == 60) return "H1";
   if(m == 240) return "H4"; if(m == 1440) return "D1"; if(m == 10080) return "W1"; if(m == 43200) return "MN";
   return IntegerToString(m) + "m";
  }

// TS 105-113: the STOP RULE
void arrStopOf(RxSer &S, int d, double valley, bool hasHost, RxZone &host, double spread, ArrStop &o)
  {
   double atr = S.atr(1), buffer = MathMax(RX_SL_ATRFRAC * atr, spread > 0 ? spread : 0);
   double vs = valley - d * buffer;
   o.buffer = buffer; o.atr = atr; o.valley = valley; o.hasHost = hasHost; if(hasHost) o.host = host;
   if(hasHost)
     {
      double hs = host.dist - d * RX_SL_HTFBUF * buffer;
      if(d > 0 ? hs <= vs : hs >= vs) { o.stop = hs; o.basis = 1; return; }
     }
   o.stop = vs; o.basis = 0;
  }
// TS 114-118
bool arrRrOf(double entry, double stop, bool hasTarget, double target, double &rr)
  {
   rr = 0;
   if(!hasTarget || entry == stop) return false;
   double r = (target - entry) / (entry - stop);
   if(r > 0) { rr = r; return true; }
   return false;
  }

// TS 122-147: every arrival zone of one TF, newest first. S = closed bars + phantom at the newest close.
int arrArrivals(RxSer &S, RxParams &p, RxZone &zones[], RxArrival &out[])
  {
   ArrayResize(out, 0); ArrayResize(zones, 0);
   if(S.n > p.max_base + 4) zcDetect(S, p, zones);
   int nz = ArraySize(zones), nb = S.n - 1;
   for(int zi = 0; zi < nz; zi++)
     {
      int L = zones[zi].legBar, d = zones[zi].dir;
      int legs[3]; int nl = 0; legs[nl++] = L;
      for(int j = L - 1; j >= 1 && nl < 3 && S.cdir(j) == d && !S.basing(j); j--) legs[nl++] = j;
      if(nb - L < 2 * RX_SWING + 6) continue;                                                  // older.length < 10
      // the removed opposite zones first (cheap; arrival.ts tests them last - all three conditions must hold, so the
      // order does not change the result), then the older bars' trend line and its cross
      int newest = legs[nl - 1];
      RxArrival A; ZeroMemory(A); A.nRem = 0;
      for(int y = 0; y < nz; y++)
         if(zones[y].dir == -d && zones[y].removed && zones[y].removedBar <= L && zones[y].removedBar >= newest) { if(A.nRem < RX_MAXREM) A.rem[A.nRem] = y; A.nRem++; }
      if(A.nRem == 0) continue;
      RxSer T; RxSlice(S, L, T);
      ZvResult r; ZvPivot pv[];
      zvLines(T, r, pv);
      if(d > 0 ? !r.hasDn : !r.hasUp) continue;
      ZvLine t; if(d > 0) t = r.dn; else t = r.up;
      int cross = -1;
      for(int q = 0; q < nl; q++) { int j = legs[q]; if(d > 0 ? S.C[j] > zvAt(t, j - L) : S.C[j] < zvAt(t, j - L)) { cross = j; break; } }
      if(cross < 0) continue;
      double valley = d > 0 ? DBL_MAX : -DBL_MAX;
      int j1 = MathMin(L + zones[zi].baseN + RX_SWING, S.n - 1);
      for(int j = L; j <= j1; j++) valley = d > 0 ? MathMin(valley, S.L[j]) : MathMax(valley, S.H[j]);
      A.zone = zones[zi];
      A.line.dir = t.dir; A.line.a = t.a + L; A.line.b = t.b + L; A.line.pa = t.pa; A.line.pb = t.pb; A.line.ta = T.T[t.a]; A.line.tb = T.T[t.b];
      for(int q = 0; q < 3; q++) A.legs[q] = q < nl ? legs[q] : -1;
      A.nLegs = nl; A.crossBar = cross; A.crossPx = zvAt(t, cross - L); A.strong = A.nRem >= 2; A.valley = valley;
      int m = ArraySize(out); ArrayResize(out, m + 1); out[m] = A;
     }
   // TS 145: stable sort by legBar ascending (detect gives one zone per legBar, oldest first)
   int m = ArraySize(out);
   for(int i = 1; i < m; i++) { RxArrival x = out[i]; int j = i - 1; while(j >= 0 && out[j].zone.legBar > x.zone.legBar) { out[j + 1] = out[j]; j--; } out[j + 1] = x; }
   return m;
  }

// arrival.ts ArrivalTf: the inputs (S / H / LS filled by the caller) and the reading
class RxReading
  {
public:
   int       tf, htf, ltf;
   RxSer     S, H, LS;
   bool      hasH, hasL;
   RxZone    zones[], hz[], lz[];
   RxArrival arr[], larr[];
   int       nArr, cur;          // cur = index into arr (-1 none)
   bool      hasPlan; RxPlan plan;
   bool      hasConfirm; RxConfirm conf;
   bool      pending;
   ZvResult  lines; ZvPivot piv[];   // this TF's own lines (zvLines on S), for the chart
  };
// TS 152-209. price = the live price, spread = the stop rule's buffer floor (price units). Requires R.S (closed bars +
// phantom at the newest close), R.H (closed HTF bars + phantom at the live price) when R.hasH, R.LS when R.hasL.
void arrArrivalTf(RxReading &R, double price, RxParams &p, double spread)
  {
   R.nArr = 0; R.cur = -1; R.hasPlan = false; R.hasConfirm = false; R.pending = false;
   ArrayResize(R.arr, 0); ArrayResize(R.zones, 0); ArrayResize(R.hz, 0); ArrayResize(R.larr, 0); ArrayResize(R.lz, 0);
   zvLines(R.S, R.lines, R.piv);
   if(R.S.n - 1 < 20) return;                                                                  // TS 155
   R.nArr = arrArrivals(R.S, p, R.zones, R.arr);
   for(int i = 0; i < R.nArr; i++) if(!R.arr[i].zone.removed) { R.cur = i; break; }             // TS 158
   if(R.cur < 0) return;
   RxZone cz = R.arr[R.cur].zone;
   int d = cz.dir;
   bool hasCeil = false, hasLN = false, Hon = false; double ceiling = 0, lineNow = 0; ArrLine cl; cl.dir = 0; cl.a = 0; cl.b = 0; cl.pa = 0; cl.pb = 0; cl.ta = 0; cl.tb = 0;
   if(R.htf > 0 && R.hasH && R.H.n - 1 >= 10)                                                  // TS 163-168
     {
      Hon = true;
      ZvResult hr; ZvPivot hp[];
      zvLines(R.H, hr, hp);
      if(d > 0 ? hr.hasDn : hr.hasUp)
        {
         ZvLine t; if(d > 0) t = hr.dn; else t = hr.up;
         lineNow = zvAt(t, 0); hasLN = true;
         cl.dir = t.dir; cl.a = t.a; cl.b = t.b; cl.pa = t.pa; cl.pb = t.pb; cl.ta = R.H.T[t.a]; cl.tb = R.H.T[t.b];
         if(d > 0 ? lineNow > price : lineNow < price) { ceiling = lineNow; hasCeil = true; }
        }
      if(R.H.n > p.max_base + 4) zcDetect(R.H, p, R.hz);
     }
   RxPlan P; ZeroMemory(P); P.nWeak = 0; P.realign = -1; P.target = -1;                                       // TS 170-171 weak
   int nz = ArraySize(R.zones);
   for(int i = 0; i < nz; i++)
      if(R.zones[i].dir == -d && !R.zones[i].removed && R.zones[i].legBar <= p.max_zone_age && (d > 0 ? RxHi(R.zones[i]) > price : RxLo(R.zones[i]) < price))
        { if(P.nWeak < RX_MAXW) P.weak[P.nWeak++] = i; }
   if(hasLN && P.nWeak > 0)                                                                    // TS 173
      for(int q = 0; q < P.nWeak; q++)
        {
         int i = P.weak[q];
         if(P.realign < 0) { P.realign = i; continue; }
         double g1 = RxGap(lineNow, R.zones[i]), g0 = RxGap(lineNow, R.zones[P.realign]);
         if(g1 < g0 || (g1 == g0 && RxGap(price, R.zones[i]) < RxGap(price, R.zones[P.realign]))) P.realign = i;
        }
   P.target = P.realign;                                                                       // TS 174
   if(P.target < 0) for(int q = 0; q < P.nWeak; q++) { int i = P.weak[q]; if(P.target < 0 || RxGap(price, R.zones[i]) < RxGap(price, R.zones[P.target])) P.target = i; }
   P.hasTargetPx = P.target >= 0; P.targetPx = P.hasTargetPx ? R.zones[P.target].prox : 0;    // TS 175
   P.hasTp = P.hasTargetPx; P.tp = P.targetPx; P.capped = false; P.extended = false; P.hasHtfZone = false;   // TS 176
   if(hasCeil)                                                                                 // TS 177-179
     {
      P.tp = !P.hasTargetPx ? ceiling : (d > 0 ? MathMin(P.targetPx, ceiling) : MathMax(P.targetPx, ceiling));
      P.hasTp = true; P.capped = P.tp == ceiling;
     }
   else if(Hon)                                                                                // TS 180-186
     {
      int c = -1, nh = ArraySize(R.hz);
      for(int i = 0; i < nh; i++)
        {
         if(!(R.hz[i].dir == -d && !R.hz[i].removed && R.hz[i].legBar <= p.max_zone_age && (d > 0 ? RxLo(R.hz[i]) > price : RxHi(R.hz[i]) < price))) continue;
         if(c < 0 || RxGap(price, R.hz[i]) < RxGap(price, R.hz[c])) c = i;
        }
      if(c >= 0)
        {
         P.htfZone = R.hz[c]; P.hasHtfZone = true;
         if(!P.hasTargetPx || (d > 0 ? R.hz[c].prox > P.targetPx : R.hz[c].prox < P.targetPx)) { P.tp = R.hz[c].prox; P.hasTp = true; P.extended = true; }
        }
     }
   int hostI = -1, nh2 = ArraySize(R.hz);                                                      // TS 187: same-side HTF host, newest
   for(int i = 0; i < nh2; i++)
     {
      if(!(R.hz[i].dir == d && !R.hz[i].removed && RxLo(R.hz[i]) <= RxHi(cz) && RxHi(R.hz[i]) >= RxLo(cz))) continue;
      if(hostI < 0 || R.hz[i].legBar < R.hz[hostI].legBar) hostI = i;
     }
   ArrStop st; ZeroMemory(st); RxZone hz0; if(hostI >= 0) hz0 = R.hz[hostI]; else hz0 = cz;
   arrStopOf(R.S, d, R.arr[R.cur].valley, hostI >= 0 && Hon, hz0, spread, st);                // TS 188
   P.dir = d; P.entry = cz.prox; P.stop = st.stop; P.buffer = st.buffer; P.atr = st.atr; P.basis = st.basis; P.valley = st.valley; P.hasHost = st.hasHost;
   if(st.hasHost) P.host = st.host;
   P.hasRR = arrRrOf(cz.prox, st.stop, P.hasTp, P.tp, P.rr);
   P.hasCeiling = hasCeil; P.ceiling = ceiling; P.hasLineNow = hasLN; P.lineNow = lineNow; P.ceilingLine = cl;
   R.plan = P; R.hasPlan = true;
   if(P.realign >= 0 && R.ltf > 0)                                                             // TS 192-207
     {
      R.pending = true;
      if(R.hasL && R.LS.n - 1 >= 20)
        {
         int nl = arrArrivals(R.LS, p, R.lz, R.larr);
         RxZone rz = R.zones[P.realign];
         datetime t0 = (datetime)(((long)cz.tLeg / 60) * 60);                                  // t16: compared to the minute
         int c = -1;
         for(int i = 0; i < nl; i++)
           {
            RxZone a = R.larr[i].zone;
            if(a.dir == -d && !a.removed && RxLo(a) <= RxHi(rz) && RxHi(a) >= RxLo(rz) && (datetime)(((long)a.tLeg / 60) * 60) >= t0) { c = i; break; }
           }
         if(c >= 0)
           {
            ZvPivot ap[]; int np = zvPivots(R.S, MathMin(RX_LOOK, R.S.n - 1 - RX_SWING), ap);
            int want = d < 0 ? 1 : -1, last = -1;
            for(int q = 0; q < np; q++) if(ap[q].t == want) last = q;
            ArrStop cs; ZeroMemory(cs); arrStopOf(R.LS, -d, R.larr[c].valley, true, rz, spread, cs);
            RxConfirm K; ZeroMemory(K);
            K.zone = R.larr[c].zone; K.arr = c; K.hasTarget = last >= 0; K.target = last >= 0 ? ap[last].p : 0; K.inArea = RxGap(price, rz) == 0;
            K.entry = K.zone.prox; K.stop = cs.stop; K.buffer = cs.buffer; K.atr = cs.atr; K.basis = cs.basis;
            K.hasRR = arrRrOf(K.zone.prox, cs.stop, K.hasTarget, K.target, K.rr);
            R.conf = K; R.hasConfirm = true; R.pending = false;
           }
        }
     }
  }

// ---- terminal loader (not in the TS: the bot gets its bars from the scanners' shards) ----
ENUM_TIMEFRAMES RxTfEnum(int m)
  {
   if(m == 1) return PERIOD_M1; if(m == 5) return PERIOD_M5; if(m == 15) return PERIOD_M15; if(m == 30) return PERIOD_M30; if(m == 60) return PERIOD_H1;
   if(m == 240) return PERIOD_H4; if(m == 1440) return PERIOD_D1; if(m == 10080) return PERIOD_W1; if(m == 43200 || m == RX_Q) return PERIOD_MN1;
   return PERIOD_CURRENT;
  }
int RxTfMin(ENUM_TIMEFRAMES tf) { if(tf == PERIOD_CURRENT) tf = (ENUM_TIMEFRAMES)Period(); return PeriodSeconds(tf) / 60; }
int RxMonthKey(datetime t) { MqlDateTime md; TimeToStruct(t, md); return md.year * 12 + md.mon - 1; }
// closed bars of TF m (shift 1.. = the terminal's shift 1..), phantom = price (<= 0: the newest close). 3M = closed
// quarters from closed MN1 bars (zonecore.toQuarters: a quarter without its last month is dropped, so is a partial first one).
bool RxLoad(string sym, int m, double price, RxSer &S)
  {
   ENUM_TIMEFRAMES tf = RxTfEnum(m);
   if(tf == PERIOD_CURRENT) return false;
   int avail = iBars(sym, tf) - 1;
   if(avail < 12) return false;
   if(m != RX_Q)
     {
      int nc = MathMin(avail, RX_MAXB);
      S.Alloc(nc, m);
      for(int i = 1; i <= nc; i++)
        {
         S.O[i] = iOpen(sym, tf, i); S.H[i] = iHigh(sym, tf, i); S.L[i] = iLow(sym, tf, i); S.C[i] = iClose(sym, tf, i); S.T[i] = iTime(sym, tf, i);
         if(S.T[i] == 0 || S.H[i] <= 0) return false;
        }
      S.Finish(price > 0 ? price : S.C[1]);
      return true;
     }
   int nm = MathMin(avail, 1500);                                                              // oldest first: months nm .. 1
   double qo[], qh[], ql[], qc[]; datetime qt[]; int qk[]; bool qLast[], qFirst[];
   int nq = 0;
   for(int i = nm; i >= 1; i--)
     {
      datetime t = iTime(sym, tf, i);
      if(t == 0) return false;
      int mk = RxMonthKey(t), key = mk / 3, mon = mk % 12;                                     // quarter key; mon 0 = Jan
      if(nq == 0 || qk[nq - 1] != key)
        {
         nq++; ArrayResize(qo, nq); ArrayResize(qh, nq); ArrayResize(ql, nq); ArrayResize(qc, nq); ArrayResize(qt, nq); ArrayResize(qk, nq); ArrayResize(qLast, nq); ArrayResize(qFirst, nq);
         qk[nq - 1] = key; qt[nq - 1] = t; qo[nq - 1] = iOpen(sym, tf, i); qh[nq - 1] = iHigh(sym, tf, i); ql[nq - 1] = iLow(sym, tf, i); qc[nq - 1] = iClose(sym, tf, i);
         qLast[nq - 1] = false; qFirst[nq - 1] = false;
        }
      else { qh[nq - 1] = MathMax(qh[nq - 1], iHigh(sym, tf, i)); ql[nq - 1] = MathMin(ql[nq - 1], iLow(sym, tf, i)); qc[nq - 1] = iClose(sym, tf, i); }
      if(mon % 3 == 2) qLast[nq - 1] = true;
      if(mon % 3 == 0) qFirst[nq - 1] = true;
     }
   int keep[]; int nk = 0; ArrayResize(keep, nq);
   for(int q = 0; q < nq; q++) { if(!qLast[q]) continue; if(q == 0 && !qFirst[q]) continue; keep[nk++] = q; }
   if(nk < 12) return false;
   int nc = MathMin(nk, RX_MAXB);
   S.Alloc(nc, m);
   for(int i = 1; i <= nc; i++) { int q = keep[nk - i]; S.O[i] = qo[q]; S.H[i] = qh[q]; S.L[i] = ql[q]; S.C[i] = qc[q]; S.T[i] = qt[q]; }
   S.Finish(price > 0 ? price : S.C[1]);
   return true;
  }
// one TF's full reading from the terminal: tf / its HTF / its confirmation TF (RxHigherTf / RxConfirmTf), live price
bool RxRead(string sym, int m, RxParams &p, double price, double spread, RxReading &R)
  {
   R.tf = m; R.htf = RxHigherTf(m); R.ltf = RxConfirmTf(m); R.hasH = false; R.hasL = false;
   if(!RxLoad(sym, m, 0, R.S)) return false;
   if(R.htf > 0) R.hasH = RxLoad(sym, R.htf, price, R.H);
   if(R.ltf > 0) R.hasL = RxLoad(sym, R.ltf, 0, R.LS);
   arrArrivalTf(R, price, p, spread);
   return true;
  }
// ==== RFX_ARRIVAL_ENGINE END ====

// ==== RFX_STRUCT BEGIN ====
//+------------------------------------------------------------------+
//| RFX structure engine 1.0 - the owner's teaching (Train page      |
//| marks, AUDUSD MN / W1 / D1 / H4, Oct 30 2026). MT5 only (drawn   |
//| by RamanFX_ZoneVision.mq5); the arrival engine above is not      |
//| changed. A line-by-line mirror of the canonical TypeScript       |
//| supabase/functions/telegram-bot/zvReal.ts (zrAtr, zrOrigin,      |
//| zrPivots, zrPair, zrImpulse, zrMomentum, zrLines, zrPhase);      |
//| conformance: tools/telegram_bot/parity/mql_port.py --struct.     |
//|  - REAL pivots = the end of a REAL correction: after an impulse  |
//|    of >= RS_MinLeg ATR, price retraces >= RS_RC of it or comes   |
//|    back within RS_Near ATR of the base that started it (RBD peak |
//|    / DBR valley); pullbacks inside an impulse = CP levels.       |
//|  - TREND lines between real pivots (the extreme is pivot 1 when  |
//|    its leg out is no impulse), kept until the first CLOSE beyond |
//|    it; re-anchored from pivot 1 while the structure continues.   |
//|  - MOMENTUM lines from a pivot whose leg out is an impulse, along|
//|    its next RS_MomBars bars (red dashed).                        |
//|  - PHASE per TF: impulse (with the trend) / correction (against  |
//|    it, target = the trend line) / range.                         |
//| Index convention = RxSer: 0 phantom, 1 newest closed, larger =   |
//| older.                                                           |
//+------------------------------------------------------------------+
#define RS_VER 100
double RS_RC = 0.38, RS_Near = 0.25, RS_MinLeg = 1.25, RS_MinSlope = 0.015, RS_MinRise = 0.25, RS_MomEff = 0.6;
int    RS_Osw = 2, RS_MomBars = 4, RS_Look = 200;

struct ZrPivot { int bar; double p; int t; int conf; };                       // t: -1 real valley, +1 real peak; conf = shift that confirmed it
struct ZrLine  { int dir; int a; int b; double pa; double pb; int brokenAt; int kind; };   // kind 0 = trend, 1 = momentum
struct ZrRes   { bool hasUp; bool hasDn; bool hasUpX; bool hasDnX; bool hasMom; ZrLine up; ZrLine dn; ZrLine upX; ZrLine dnX; ZrLine mom; };
struct ZrPhase { int trend; int leg; int phase; bool hasTarget; double target; };   // phase 0 range, 1 impulse, 2 correction

double zrSlope(ZrLine &t) { return (t.pb - t.pa) / MathMax(1, t.a - t.b); }
double zrAt(ZrLine &t, double j) { return t.pb + zrSlope(t) * (t.b - j); }
int    zrAtrLast(RxSer &S) { int last = 0; for(int i = 1; i < S.n; i++) if(S.zvAtr(i) > 0) last = i; return last; }
double zrA(RxSer &S, int i, int al) { return MathMax(S.zvAtr(MathMin(i, al)), 1e-12); }
bool   zrOut(int d, double x, double y) { return d > 0 ? x < y : x > y; }     // x further out than y (lower low / higher high)
bool   zrBeyond(RxSer &S, ZrLine &t, int d, int j) { return d > 0 ? S.C[j] < zrAt(t, j) : S.C[j] > zrAt(t, j); }   // a CLOSE beyond

int zrOrigin(RxSer &S, int x, int f, bool up)
  {
   int o = x;
   for(int j = x + 1; j <= f; j++)
     {
      if(up ? S.L[j] < S.L[o] : S.H[j] > S.H[o]) o = j;
      if(o != j) continue;
      bool sw = true;
      for(int k = 1; k <= RS_Osw && sw; k++)
        {
         if(j + k <= f && (up ? S.L[j] > S.L[j + k] : S.H[j] < S.H[j + k])) sw = false;
         if(j - k >= 1 && (up ? S.L[j] >= S.L[j - k] : S.H[j] <= S.H[j - k])) sw = false;
        }
      if(sw) return j;
     }
   return o;
  }
void zrAddPiv(ZrPivot &out[], int b, double p, int t, int c) { int m = ArraySize(out); ArrayResize(out, m + 1); out[m].bar = b; out[m].p = p; out[m].t = t; out[m].conf = c; }
int zrPivots(RxSer &S, int bars, int al, ZrPivot &out[])
  {
   ArrayResize(out, 0);
   if(bars < 3) return 0;
   int d = 0, hi = bars, lo = bars;
   for(int j = bars - 1; j >= 1; j--)
     {
      if(d >= 0 && S.H[j] > S.H[hi]) hi = j;
      if(d <= 0 && S.L[j] < S.L[lo]) lo = j;
      int m0 = ArraySize(out);
      int f = m0 > 0 ? out[m0 - 1].bar : bars;
      if(d >= 0 && hi > j)
        {
         int o = zrOrigin(S, hi, f, true);
         double leg = S.H[hi] - S.L[o], m = DBL_MAX;
         for(int k = hi - 1; k >= j; k--) m = MathMin(m, S.L[k]);
         double need = MathMax(0.0, MathMin(RS_RC * leg, S.H[hi] - MathMax(S.O[o], S.C[o]) - RS_Near * zrA(S, hi, al)));
         if(leg >= RS_MinLeg * zrA(S, hi, al) && S.H[hi] - m >= need)
           {
            if(m0 == 0 && o > hi) zrAddPiv(out, o, S.L[o], -1, j);
            zrAddPiv(out, hi, S.H[hi], 1, j); d = -1; lo = hi - 1;
            for(int k = hi - 1; k >= j; k--) if(S.L[k] <= S.L[lo]) lo = k;
            continue;
           }
        }
      if(d <= 0 && lo > j)
        {
         int o = zrOrigin(S, lo, f, false);
         double leg = S.H[o] - S.L[lo], m = -DBL_MAX;
         for(int k = lo - 1; k >= j; k--) m = MathMax(m, S.H[k]);
         double need = MathMax(0.0, MathMin(RS_RC * leg, MathMin(S.O[o], S.C[o]) - S.L[lo] - RS_Near * zrA(S, lo, al)));
         if(leg >= RS_MinLeg * zrA(S, lo, al) && m - S.L[lo] >= need)
           {
            if(m0 == 0 && o > lo) zrAddPiv(out, o, S.H[o], 1, j);
            zrAddPiv(out, lo, S.L[lo], -1, j); d = 1; hi = lo - 1;
            for(int k = lo - 1; k >= j; k--) if(S.H[k] >= S.H[hi]) hi = k;
            continue;
           }
        }
      int m1 = ArraySize(out);
      if(d == -1 && m1 > 0 && S.H[j] > out[m1 - 1].p) { ArrayResize(out, m1 - 1); d = 1; hi = j; }
      else if(d == 1 && m1 > 0 && S.L[j] < out[m1 - 1].p) { ArrayResize(out, m1 - 1); d = -1; lo = j; }
     }
   return ArraySize(out);
  }
// a trend line o (older) -> n (newer): FitAnchor clean older anchor; false when in the wrong order or too flat
bool zrPair(RxSer &S, ZrPivot &o, ZrPivot &n, int d, int al, ZrLine &t)
  {
   if(d > 0 ? !(n.p > o.p) : !(n.p < o.p)) return false;
   int a = zvFitAnchor(S, o.bar, n.bar, n.p, d);
   t.dir = d; t.a = a; t.b = n.bar; t.pa = d > 0 ? S.L[a] : S.H[a]; t.pb = n.p; t.brokenAt = -1; t.kind = 0;
   if(d > 0 ? !(t.pb > t.pa) : !(t.pb < t.pa)) return false;
   double ab = zrA(S, t.b, al);
   if(MathAbs(zrSlope(t)) < RS_MinSlope * ab || MathAbs(t.pb - t.pa) < RS_MinRise * ab) return false;
   return true;
  }
bool zrImpulse(RxSer &S, int pb, int pt, int al)
  {
   int e = pb - RS_MomBars;
   if(e < 1) return false;
   int d = -pt;
   double r0 = d < 0 ? S.H[pb] : S.L[pb], fx = r0;
   for(int j = pb - 1; j >= e; j--) fx = d < 0 ? MathMin(fx, S.L[j]) : MathMax(fx, S.H[j]);
   return d * (fx - r0) >= RS_MomEff * RS_MomBars * zrA(S, pb, al);
  }
bool zrMomentum(RxSer &S, int pb, int pt, int al, ZrLine &t)
  {
   if(!zrImpulse(S, pb, pt, al)) return false;
   int d = -pt, A = pb, e = A - RS_MomBars, b = -1;
   double sl = 0, pA = d > 0 ? S.L[A] : S.H[A];
   for(int j = A - 1; j >= e; j--) { double s = ((d > 0 ? S.L[j] : S.H[j]) - pA) / (A - j); if(b < 0 || (d > 0 ? s < sl : s > sl)) { b = j; sl = s; } }
   if(b < 0 || d * sl <= 0) return false;
   t.dir = d; t.a = A; t.b = b; t.pa = pA; t.pb = d > 0 ? S.L[b] : S.H[b]; t.brokenAt = -1; t.kind = 1;
   for(int j = e - 1; j >= 1; j--) if(zrBeyond(S, t, d, j)) { t.brokenAt = j; break; }
   return true;
  }
void zrHistPush(ZrLine &h[], ZrLine &t) { int m = ArraySize(h); ArrayResize(h, m + 1); h[m] = t; }
void zrHistDel(ZrLine &h[], int i) { int m = ArraySize(h); for(int x = i; x < m - 1; x++) h[x] = h[x + 1]; ArrayResize(h, m - 1); }
// the owner's lines of one TF: hist = every line drawn (trend + momentum), newest older-anchor first
void zrLines(RxSer &S, ZrRes &res, ZrPivot &piv[], ZrLine &hist[])
  {
   res.hasUp = false; res.hasDn = false; res.hasUpX = false; res.hasDnX = false; res.hasMom = false;
   ArrayResize(piv, 0); ArrayResize(hist, 0);
   int bars = MathMin(RS_Look, S.n - 1 - RS_Osw);
   if(bars <= RS_Osw + 2) return;
   int al = zrAtrLast(S);
   zrPivots(S, bars, al, piv);
   int np = ArraySize(piv);
   for(int d = 1; d >= -1; d -= 2)
     {
      int want = d > 0 ? -1 : 1, k = 0, extBar = -1, nSeen = 0, liveIdx = -1, brkIdx = -1;
      double extP = 0;
      int seen[]; ArrayResize(seen, np + 1);
      bool hasP1 = false, hasPend = false, hasLast = false, hasBrk = false;
      ZrPivot p1, pend, lastB; ZeroMemory(p1); ZeroMemory(pend); ZeroMemory(lastB);
      ZrLine brk; ZeroMemory(brk);
      for(int j = bars; j >= 1; j--)
        {
         if(liveIdx >= 0 && j < hist[liveIdx].b && zrBeyond(S, hist[liveIdx], d, j)) { hist[liveIdx].brokenAt = j; brk = hist[liveIdx]; hasBrk = true; brkIdx = liveIdx; liveIdx = -1; }
         double xj = d > 0 ? S.L[j] : S.H[j];
         if(extBar < 0 || zrOut(d, xj, extP))
           {
            if(liveIdx >= 0) { hist[liveIdx].brokenAt = j; brk = hist[liveIdx]; hasBrk = true; brkIdx = liveIdx; liveIdx = -1; }
            extBar = j; extP = xj; hasP1 = false; nSeen = 0; hasLast = false; hasPend = false;
           }
         if(hasPend && !hasP1 && pend.bar - RS_MomBars >= j)
           {
            if(!zrImpulse(S, pend.bar, pend.t, al)) { p1 = pend; hasP1 = true; nSeen = 0; hasLast = false; }
            hasPend = false;
           }
         for(; k < np && piv[k].conf >= j; k++)
           {
            if(piv[k].t != want) continue;
            if(piv[k].bar == extBar) { pend = piv[k]; hasPend = true; continue; }
            if(!zrOut(d, extP, piv[k].p)) continue;
            if(!hasP1 || !zrOut(d, p1.p, piv[k].p) || (hasLast && liveIdx < 0 && zrOut(d, piv[k].p, lastB.p)))
              {
               if(liveIdx >= 0) { hist[liveIdx].brokenAt = piv[k].bar; brk = hist[liveIdx]; hasBrk = true; brkIdx = liveIdx; liveIdx = -1; }
               p1 = piv[k]; hasP1 = true; nSeen = 0; hasLast = false;
               continue;
              }
            seen[nSeen++] = k;
            if(liveIdx >= 0) continue;
            // pivot 2: the tangent order from pivot 1 (flattest first, the newer on a tie), the first valid zrPair
            int tried[]; ArrayResize(tried, nSeen); ArrayInitialize(tried, 0);
            bool got = false; int q = -1; ZrLine t; ZeroMemory(t);
            for(int r = 0; r < nSeen && !got; r++)
              {
               int bi = -1; double bs = 0;
               for(int x = 0; x < nSeen; x++)
                 {
                  if(tried[x] != 0) continue;
                  double s = (piv[seen[x]].p - p1.p) / (p1.bar - piv[seen[x]].bar);
                  if(bi < 0 || (d > 0 ? s < bs : s > bs) || (s == bs && piv[seen[x]].bar < piv[seen[bi]].bar)) { bi = x; bs = s; }
                 }
               tried[bi] = 1; q = seen[bi];
               got = zrPair(S, p1, piv[q], d, al, t);
              }
            if(!got) { if(nSeen == 1) { p1 = piv[k]; nSeen = 0; } continue; }   // equal lows: the newer is the base
            if(brkIdx >= 0 && brk.a == t.a) { zrHistDel(hist, brkIdx); brkIdx = -1; }   // re-anchored from pivot 1: replaces it
            lastB = piv[q]; hasLast = true;
            int bj = -1;
            for(int x = t.b - 1; x >= j; x--) if(zrBeyond(S, t, d, x)) { bj = x; break; }
            zrHistPush(hist, t);
            if(bj >= 0) { hist[ArraySize(hist) - 1].brokenAt = bj; brk = hist[ArraySize(hist) - 1]; hasBrk = true; brkIdx = ArraySize(hist) - 1; continue; }
            liveIdx = ArraySize(hist) - 1;
           }
        }
      if(d > 0) { res.hasUp = liveIdx >= 0; if(liveIdx >= 0) res.up = hist[liveIdx]; res.hasUpX = hasBrk; res.upX = brk; }
      else      { res.hasDn = liveIdx >= 0; if(liveIdx >= 0) res.dn = hist[liveIdx]; res.hasDnX = hasBrk; res.dnX = brk; }
     }
   for(int i = 0; i < np; i++) { ZrLine m; ZeroMemory(m); if(zrMomentum(S, piv[i].bar, piv[i].t, al, m)) zrHistPush(hist, m); }
   // stable sort by (a, b) ascending, then reversed (= the TS sort().reverse())
   int nh = ArraySize(hist);
   for(int i = 1; i < nh; i++)
     {
      ZrLine v = hist[i]; int x = i - 1;
      while(x >= 0 && (hist[x].a > v.a || (hist[x].a == v.a && hist[x].b > v.b))) { hist[x + 1] = hist[x]; x--; }
      hist[x + 1] = v;
     }
   for(int i = 0; i < nh / 2; i++) { ZrLine v = hist[i]; hist[i] = hist[nh - 1 - i]; hist[nh - 1 - i] = v; }
   if(np > 0) for(int i = 0; i < nh; i++) if(hist[i].kind == 1 && hist[i].a == piv[np - 1].bar) { res.mom = hist[i]; res.hasMom = true; break; }
  }
// the TF's phase now: trend from the last two peaks / valleys (a close beyond the last HL / LH = no trend), the leg
// from the last pivot; a correction's target = the live trend line now, else the HL / LH that holds the trend
void zrPhase(RxSer &S, ZrRes &r, ZrPivot &piv[], ZrPhase &ph)
  {
   int np = ArraySize(piv), pk1 = -1, pk2 = -1, vl1 = -1, vl2 = -1;
   for(int i = np - 1; i >= 0; i--)
     {
      if(piv[i].t > 0) { if(pk1 < 0) pk1 = i; else if(pk2 < 0) pk2 = i; }
      else             { if(vl1 < 0) vl1 = i; else if(vl2 < 0) vl2 = i; }
     }
   int trend = 0;
   if(pk2 >= 0 && vl2 >= 0)
     {
      if(piv[pk1].p > piv[pk2].p && piv[vl1].p > piv[vl2].p) trend = 1;
      else if(piv[pk1].p < piv[pk2].p && piv[vl1].p < piv[vl2].p) trend = -1;
     }
   if(trend > 0 && S.C[1] < piv[vl1].p) trend = 0;
   if(trend < 0 && S.C[1] > piv[pk1].p) trend = 0;
   int leg = np > 0 ? -piv[np - 1].t : 0;
   ph.trend = trend; ph.leg = leg; ph.phase = (trend == 0 || leg == 0) ? 0 : (leg == trend ? 1 : 2); ph.hasTarget = false; ph.target = 0;
   if(ph.phase != 2) return;
   if(trend > 0 && r.hasUp) { ph.hasTarget = true; ph.target = zrAt(r.up, 0); }
   else if(trend < 0 && r.hasDn) { ph.hasTarget = true; ph.target = zrAt(r.dn, 0); }
   else if(trend > 0) { ph.hasTarget = true; ph.target = piv[vl1].p; }
   else { ph.hasTarget = true; ph.target = piv[pk1].p; }
  }
string zrDirWord(int d) { return d > 0 ? "up" : (d < 0 ? "down" : "sideways"); }
string zrPhaseText(string tfn, ZrPhase &p, int digits)
  {
   if(p.phase == 0) return tfn + " range";
   if(p.phase == 1) return tfn + " impulse " + zrDirWord(p.trend);
   return tfn + " correction (" + zrDirWord(p.leg) + ")" + (p.hasTarget ? " -> " + tfn + " " + zrDirWord(p.trend) + " trend " + DoubleToString(p.target, digits) : "");
  }
// ==== RFX_STRUCT END ====

#endif // RFX_ZONECORE_MQH
