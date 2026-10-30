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
//| 2.00 (owner rules, Oct 2026 = the Telegram bot's arrival.ts):    |
//| trend lines through the 2 most recent real peaks / valleys (wick |
//| re-anchored, broken = gone, no overall line), Kevin's red        |
//| momentum line, ARRIVAL zones (X on the zones removed, weak       |
//| zones, realignment area, stop rule, TP / ceiling, lower-TF       |
//| confirmation) + alerts. Same engine as MT5 (RFX_ARRIVAL_ENGINE). |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "2.00"
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
input bool   InpTLTwoPivot    = true;   // Owner rule (2.00): ONE line each way through the 2 most recent real peaks / valleys, wick re-anchored; broken = not drawn (false = 1.99 lines)
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
input string Sep9             = "-- ARRIVAL zones (owner rules Oct 2026, = the Telegram bot) --"; // -----
input bool   InpArrShow       = true;   // ARRIVAL zone: bold box + tag (its leg-out closed beyond the trend line and removed opposite zones; 2+ = STRONG)
input bool   InpArrShowRemoved= true;   // Zones the arrival removed: dotted box with an X
input bool   InpArrShowWeak   = true;   // Same-TF opposite zones made WEAK by the arrival: dashed, "weak - no limit"
input bool   InpArrShowRealign= true;   // Realignment area: the weak zone nearest the higher-TF trend line (gold)
input bool   InpArrShowPlan   = true;   // Plan lines: entry, SL (stop rule), TP (capped at the HTF line / extended to the HTF zone), ceiling
input bool   InpArrShowConfirm= true;   // Lower-TF confirmation (H4 -> M15, D1 -> H1, W1 -> H4, MN -> D1): its zone, entry, SL, target
input bool   InpArrShowMomentum = true; // Kevin's momentum line: thin red dashed, only when there is no trend line that way (never a trend line)
input bool   InpArrAlertNew   = true;   // Alert: a new arrival zone on this chart's timeframe
input bool   InpArrAlertRealign = false; // Alert: price entered the realignment area
input bool   InpArrAlertConfirm = true;  // Alert: lower-TF confirmation (an arrival inside the realignment area)
input bool   InpArrPush       = false;  // Also push the arrival alerts to the phone (MetaQuotes ID)
input int    InpArrMarket     = 0;      // Arrival zone settings: 0 = FX (Raja, 7+ candle base = no zone, the bot's FX scan), 1 = stocks (Raja)
input double InpArrSpreadPips = 0;      // Stop-rule spread floor in pips (0 = the live spread); buffer = max(0.1 x ATR14, spread)

#define PFX "RFXV_"
#define RXA_PFX "RFXA_"                  // arrival objects (RFX_ARRIVAL_CHART)

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
struct ZvLine  { int dir; int a; int b; double pa; double pb; int cuts; };
struct ZvResult { bool hasUp; bool hasDn; bool hasMom; ZvLine up; ZvLine dn; ZvLine mom; string whyUp; string whyDn; };
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
   double tol = 0.05 * S.zvAtr(1);
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
void RxSetWhy(ZvResult &res, int d, string why) { if(d > 0) { res.whyUp = why; res.hasUp = false; } else { res.whyDn = why; res.hasDn = false; } }
// TS 93-140: the two lines of one TF (+ at most one momentum line); piv = the pivots (out)
void zvLines(RxSer &S, ZvResult &res, ZvPivot &piv[])
  {
   res.hasUp = false; res.hasDn = false; res.hasMom = false; res.whyUp = "too few bars"; res.whyDn = "too few bars";
   ArrayResize(piv, 0);
   int bars = MathMin(RX_LOOK, S.n - 1 - RX_SWING);                                            // TS 98
   if(bars <= RX_SWING + 2) return;
   zvPivots(S, bars, piv);
   for(int d = 1; d >= -1; d -= 2)                                                             // TS 102: [1, -1]
     {
      int want = d > 0 ? -1 : 1, io = -1, inw = -1, np = ArraySize(piv);
      for(int k = 0; k < np; k++) if(piv[k].t == want) { io = inw; inw = k; }                  // ps[len - 2], ps[len - 1]
      if(io < 0) { RxSetWhy(res, d, d > 0 ? "fewer than two real valleys" : "fewer than two real peaks"); continue; }
      if(d > 0 ? !(piv[inw].p > piv[io].p) : !(piv[inw].p < piv[io].p)) { RxSetWhy(res, d, d > 0 ? "newer valley not higher" : "newer peak not lower"); continue; }
      int a = zvFitAnchor(S, piv[io].bar, piv[inw].bar, piv[inw].p, d);                         // TS 111
      ZvLine t; t.dir = d; t.a = a; t.b = piv[inw].bar; t.pa = d > 0 ? S.L[a] : S.H[a]; t.pb = piv[inw].p; t.cuts = 0;
      if(d > 0 ? !(t.pb > t.pa) : !(t.pb < t.pa)) { RxSetWhy(res, d, d > 0 ? "newer valley not higher" : "newer peak not lower"); continue; }
      double sl = zvSlope(t);
      double ab = MathMax(S.zvAtr(t.b), 1e-12);                                                // TS 116-117 TooFlat
      if(MathAbs(sl) < 0.015 * ab || MathAbs(t.pb - t.pa) < 1.5 * ab) { RxSetWhy(res, d, "too flat"); continue; }
      double ext = d > 0 ? -DBL_MAX : DBL_MAX;                                                   // TS 119-127 Confirmed
      for(int j = t.a - 1; j > t.b; j--) ext = d > 0 ? MathMax(ext, S.H[j]) : MathMin(ext, S.L[j]);
      bool conf = false;
      if(ext != DBL_MAX && ext != -DBL_MAX)
         for(int j = t.b - 1; j >= 1; j--)
           {
            double lv = zvAt(t, j);
            if((d > 0 && S.H[j] < lv) || (d < 0 && S.L[j] > lv)) break;
            if((d > 0 && S.H[j] > ext) || (d < 0 && S.L[j] < ext)) { conf = true; break; }
           }
      if(!conf) { RxSetWhy(res, d, "not confirmed"); continue; }
      int rm = -1;                                                                               // TS 129-131 RemovedAt
      for(int j = t.b - 1; j >= 1; j--) { double lv = zvAt(t, j); if((d > 0 && S.H[j] < lv) || (d < 0 && S.L[j] > lv)) { rm = j; break; } }
      if(rm >= 0) { RxSetWhy(res, d, "broken at shift " + IntegerToString(rm)); continue; }
      double tol = 0.05 * S.zvAtr(1);                                                          // TS 132-133 cuts
      for(int j = t.a - 1; j > t.b; j--) if((d > 0 ? zvAt(t, j) - S.L[j] : S.H[j] - zvAt(t, j)) > tol) t.cuts++;
      if(d > 0) { res.up = t; res.hasUp = true; res.whyUp = "ok"; } else { res.dn = t; res.hasDn = true; res.whyDn = "ok"; }
     }
   // TS 136-138: a momentum line only for a direction without a trend line; the leg whose extreme is the newest
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
   out.dir = d; out.a = A; out.b = b; out.pa = RxP(S, d, A); out.pb = pb; out.cuts = 0; e = E;
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

// ==== RFX_ARRIVAL_CHART BEGIN ====
//+------------------------------------------------------------------+
//| Arrival drawing + alerts (ZoneVision). SHARED VERBATIM by        |
//| RamanFX_ZoneVision.mq5 and RamanFX_ZoneVision.mq4 (edit the .mq5 |
//| copy, then `node scripts/sync-arrival-mql.mjs`). Reads the       |
//| engine (RFX_ARRIVAL_ENGINE) for this chart's TF, its next higher |
//| TF (ceiling / realignment line) and its confirmation TF (H4 ->   |
//| M15, D1 -> H1, W1 -> H4, MN -> D1, H1 -> M15). Host contract:    |
//| #define RXA_PFX, the InpArr* inputs, InpDemandLine, InpSupplyLine,|
//| InpMuted; the host calls RxaTick(false) from OnCalculate and     |
//| ObjectsDeleteAll(0, RXA_PFX) in OnDeinit.                        |
//| Draws: the ARRIVAL zone (bold box + tag), the zones its leg-out  |
//| removed (X), the trend line it crossed (dotted), the same-TF     |
//| opposite zones made WEAK (dashed, "weak - no limit"), the        |
//| realignment area (gold), entry / SL (stop rule) / TP / ceiling   |
//| lines, the lower-TF confirmation zone and its plan, and Kevin's  |
//| momentum line (thin red dashed: never a trend line).             |
//+------------------------------------------------------------------+
RxReading gRxa;
bool      gRxaOk = false, gRxaArmed = false, gRxaIn = false;
string    gRxaSeen[];
datetime  gRxaT0 = 0, gRxaTL = 0, gRxaTH = 0;
int       gRxaTries = 0;
double    gRxaRLo = 0, gRxaRHi = 0;
string    gRxaRKey = "", gRxaRTxt = "";

bool   RxaSeen(string k) { for(int i = 0; i < ArraySize(gRxaSeen); i++) if(gRxaSeen[i] == k) return true; return false; }
void   RxaMark(string k) { int n = ArraySize(gRxaSeen); if(n > 300) { ArrayResize(gRxaSeen, 0); n = 0; } ArrayResize(gRxaSeen, n + 1); gRxaSeen[n] = k; }
void   RxaNotify(string m) { Alert(m); if(InpArrPush) SendNotification(StringLen(m) > 250 ? StringSubstr(m, 0, 250) : m); }
double RxaPip() { return (_Digits == 3 || _Digits == 5) ? _Point * 10 : _Point; }
string RxaPx(double p) { return DoubleToString(p, _Digits); }
datetime RxaRight() { return iTime(_Symbol, PERIOD_CURRENT, 0) + PeriodSeconds() * 6; }
string RxaZTxt(RxZone &z) { return (z.dir > 0 ? "demand " : "supply ") + RxaPx(z.prox) + " - " + RxaPx(z.dist); }
void RxaBox(string nm, datetime t1, double p1, datetime t2, double p2, color c, int style, int width, bool fill, string tip)
  {
   ObjectCreate(0, nm, OBJ_RECTANGLE, 0, t1, p1, t2, p2);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, c); ObjectSetInteger(0, nm, OBJPROP_STYLE, style); ObjectSetInteger(0, nm, OBJPROP_WIDTH, width);
   ObjectSetInteger(0, nm, OBJPROP_BACK, fill);                    // MT4: a background rectangle is filled, a foreground one an outline
#ifdef __MQL5__
   ObjectSetInteger(0, nm, OBJPROP_FILL, fill);
#endif
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
   ObjectSetString(0, nm, OBJPROP_TOOLTIP, tip);
  }
void RxaText(string nm, datetime t, double p, string txt, color c, int size, int anchor, bool bold, string tip)
  {
   ObjectCreate(0, nm, OBJ_TEXT, 0, t, p);
   ObjectSetString(0, nm, OBJPROP_TEXT, txt); ObjectSetString(0, nm, OBJPROP_FONT, bold ? "Arial Bold" : "Arial");
   ObjectSetInteger(0, nm, OBJPROP_FONTSIZE, size); ObjectSetInteger(0, nm, OBJPROP_COLOR, c); ObjectSetInteger(0, nm, OBJPROP_ANCHOR, anchor);
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
   ObjectSetString(0, nm, OBJPROP_TOOLTIP, tip);
  }
void RxaLine(string nm, datetime t1, double p1, datetime t2, double p2, color c, int style, int width, string tip)
  {
   ObjectCreate(0, nm, OBJ_TREND, 0, t1, p1, t2, p2);
   ObjectSetInteger(0, nm, OBJPROP_RAY_RIGHT, false);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, c); ObjectSetInteger(0, nm, OBJPROP_STYLE, style); ObjectSetInteger(0, nm, OBJPROP_WIDTH, width);
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
   ObjectSetString(0, nm, OBJPROP_TOOLTIP, tip);
  }
void RxaHL(string nm, datetime t1, datetime t2, double p, color c, int style, string txt, string tip)
  {
   RxaLine(nm, t1, p, t2, p, c, style, 1, tip);
   if(txt != "") RxaText(nm + "t", t2, p, " " + txt, c, 7, ANCHOR_LEFT, false, tip);
  }

// the host calls this on every OnCalculate: a full reading only when a bar opened on this chart, its HTF or its LTF
void RxaTick(bool force)
  {
   if(!(InpArrShow || InpArrShowMomentum || InpArrAlertNew || InpArrAlertRealign || InpArrAlertConfirm)) return;
   int m = RxTfMin(PERIOD_CURRENT), hm = RxHigherTf(m), lm = RxConfirmTf(m);
   datetime t0 = iTime(_Symbol, PERIOD_CURRENT, 0);
   datetime th = hm > 0 ? iTime(_Symbol, RxTfEnum(hm), 0) : 0, tl = lm > 0 ? iTime(_Symbol, RxTfEnum(lm), 0) : 0;
   if(force || t0 != gRxaT0 || th != gRxaTH || tl != gRxaTL)
     {
      gRxaT0 = t0; gRxaTH = th; gRxaTL = tl;
      RxaRun();
      // the terminal may still be loading the HTF / LTF history: read again on the next ticks
      if((!gRxaOk || (gRxa.htf > 0 && !gRxa.hasH) || (gRxa.ltf > 0 && !gRxa.hasL)) && gRxaTries < 30) { gRxaTries++; gRxaT0 = 0; }
      else gRxaTries = 0;
     }
   RxaRealignTick();
  }
void RxaRun()
  {
   ObjectsDeleteAll(0, RXA_PFX);
   RxParams p; if(InpArrMarket == 1) RxParamsRaja(p); else RxParamsFX(p);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID), ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double spread = InpArrSpreadPips > 0 ? InpArrSpreadPips * RxaPip() : MathMax(0, ask - bid);
   gRxaOk = bid > 0 && RxRead(_Symbol, RxTfMin(PERIOD_CURRENT), p, bid, spread, gRxa);
   if(!gRxaOk) return;
   RxaDraw();
   RxaAlerts(bid);
   gRxaArmed = true;
   ChartRedraw();
  }
void RxaDraw()
  {
   string tfn = RxTfName(gRxa.tf), htn = gRxa.htf > 0 ? RxTfName(gRxa.htf) : "HTF", ltn = gRxa.ltf > 0 ? RxTfName(gRxa.ltf) : "LTF";
   datetime right = RxaRight();
   string sum = "ARRIVAL " + tfn + ": ";
   // Kevin's momentum line: only for a direction with no trend line on the newest leg, never a trend line
   if(InpArrShowMomentum && gRxa.lines.hasMom)
     {
      ZvLine mo = gRxa.lines.mom;
      string tip = tfn + " momentum line (Kevin): a steep one-way leg with no real " + (mo.dir > 0 ? "valley" : "peak") + " - its break is often a false breakout; NOT a trend line";
      RxaLine(RXA_PFX + "mom", gRxa.S.T[mo.a], mo.pa, right, zvAt(mo, -6), clrRed, STYLE_DASH, 1, tip);
      RxaText(RXA_PFX + "momt", right, zvAt(mo, -6), " momentum", clrRed, 7, ANCHOR_LEFT, false, tip);
     }
   if(!InpArrShow) return;
   if(gRxa.cur < 0) sum += "none";
   else
     {
      RxArrival A = gRxa.arr[gRxa.cur];
      color c = A.zone.dir > 0 ? InpDemandLine : InpSupplyLine;
      string kind = A.zone.dir > 0 ? "demand" : "supply";
      string tip = StringFormat("%s ARRIVAL %s: the leg-out closed %s the %s %s trend line and removed %d opposite zone(s)%s", tfn, kind, A.zone.dir > 0 ? "above" : "below", tfn,
                                A.zone.dir > 0 ? "down" : "up", A.nRem, A.strong ? " = STRONG" : "");
      RxaBox(RXA_PFX + "az", A.zone.baseStart, A.zone.prox, right, A.zone.dist, c, STYLE_SOLID, 3, false, tip);
      RxaText(RXA_PFX + "azt", A.zone.baseStart, A.zone.prox, "ARRIVAL " + kind + (A.strong ? StringFormat(" STRONG (%d removed)", A.nRem) : " (1 removed)"), c, 9,
              A.zone.dir > 0 ? ANCHOR_LEFT_LOWER : ANCHOR_LEFT_UPPER, true, tip);
      RxaLine(RXA_PFX + "al", A.line.ta, A.line.pa, gRxa.S.T[A.crossBar], A.crossPx, InpMuted, STYLE_DOT, 1, tfn + " trend line the arrival's leg-out closed beyond");
      sum += (A.strong ? "STRONG " : "") + RxaZTxt(A.zone);
      if(InpArrShowRemoved)
         for(int q = 0; q < MathMin(A.nRem, RX_MAXREM); q++)
           {
            RxZone y = gRxa.zones[A.rem[q]];
            string nm = RXA_PFX + "rx" + IntegerToString(q), yt = "Removed by the arrival's leg-out: " + RxaZTxt(y);
            RxaBox(nm, y.baseStart, y.prox, gRxa.S.T[y.removedBar], y.dist, InpMuted, STYLE_DOT, 1, false, yt);
            RxaText(nm + "x", gRxa.S.T[y.removedBar], (y.prox + y.dist) / 2, "X", y.dir > 0 ? InpDemandLine : InpSupplyLine, 12, ANCHOR_CENTER, true, yt);
           }
     }
   if(gRxa.hasPlan)
     {
      RxPlan P = gRxa.plan;
      RxArrival A2 = gRxa.arr[gRxa.cur];
      if(InpArrShowWeak)
         for(int q = 0; q < P.nWeak; q++)
           {
            if(P.weak[q] == P.realign && InpArrShowRealign) continue;
            RxZone z = gRxa.zones[P.weak[q]];
            string nm = RXA_PFX + "wk" + IntegerToString(q);
            string wt = StringFormat("WEAK after the %s arrival (Raja): no limit %s on %s - wait for a lower-TF arrival", P.dir > 0 ? "demand" : "supply", z.dir > 0 ? "buys" : "sells", tfn);
            RxaBox(nm, z.baseStart, z.prox, right, z.dist, z.dir > 0 ? InpDemandLine : InpSupplyLine, STYLE_DASH, 1, false, wt);
            RxaText(nm + "t", z.baseStart, z.prox, "weak - no limit", InpMuted, 7, z.dir > 0 ? ANCHOR_LEFT_LOWER : ANCHOR_LEFT_UPPER, false, wt);
           }
      if(InpArrShowRealign && P.realign >= 0)
        {
         RxZone z = gRxa.zones[P.realign];
         string rt = StringFormat("REALIGNMENT area: the weak %s zone nearest the %s trend line (now %s). Trade it only after a %s arrival inside it.", tfn, htn, RxaPx(P.lineNow), ltn);
         RxaBox(RXA_PFX + "rl", z.baseStart, z.prox, right, z.dist, C'255,226,140', STYLE_SOLID, 1, true, rt);
         RxaBox(RXA_PFX + "rlb", z.baseStart, z.prox, right, z.dist, clrGoldenrod, STYLE_SOLID, 2, false, rt);
         RxaText(RXA_PFX + "rlt", z.baseStart, z.prox, "REALIGN area (" + htn + " line " + RxaPx(P.lineNow) + ")" + (gRxa.pending ? " - waiting for a " + ltn + " arrival" : ""), clrDarkGoldenrod, 8,
                 z.dir > 0 ? ANCHOR_LEFT_LOWER : ANCHOR_LEFT_UPPER, true, rt);
         sum += " | realign " + RxaPx(z.prox) + (gRxa.pending ? " (waiting " + ltn + ")" : "");
        }
      if(InpArrShowPlan)
        {
         datetime t1 = gRxa.S.T[A2.zone.legBar];
         string bt = P.basis == 1 ? StringFormat("2 buffers beyond the %s %s zone's distal (%s)", htn, P.dir > 0 ? "demand" : "supply", RxaPx(P.host.dist)) : "the valley " + RxaPx(P.valley) + " - 1 buffer";
         RxaHL(RXA_PFX + "pe", t1, right, P.entry, P.dir > 0 ? InpDemandLine : InpSupplyLine, STYLE_SOLID, "entry " + RxaPx(P.entry), "Arrival entry: the zone's proximal");
         RxaHL(RXA_PFX + "ps", t1, right, P.stop, clrRed, STYLE_DASH, "SL " + RxaPx(P.stop) + (P.basis == 1 ? " (" + htn + " zone)" : " (valley)"),
               StringFormat("Stop rule: %s; buffer = max(0.1 x ATR14 %s, spread) = %s", bt, tfn, RxaPx(P.buffer)));
         if(P.hasTp)
            RxaHL(RXA_PFX + "pt", t1, right, P.tp, clrForestGreen, STYLE_DASH, "TP " + RxaPx(P.tp) + (P.capped ? " (capped: " + htn + " line)" : (P.extended ? " (" + htn + " zone)" : "")) + (P.hasRR ? StringFormat(" 1:%.1f", P.rr) : ""),
                  P.capped ? "Target capped before the intact " + htn + " trend line (the ceiling)" : (P.extended ? "The " + htn + " line is crossed: target extended to the " + htn + " zone" : "Target: the weak zone's proximal"));
         if(P.hasCeiling && !P.capped)
            RxaHL(RXA_PFX + "pc", t1, right, P.ceiling, clrGoldenrod, STYLE_DOT, htn + " line (ceiling)", "The intact " + htn + " trend line against the arrival, now");
         sum += " | SL " + RxaPx(P.stop) + (P.basis == 1 ? " " + htn : " valley") + " | TP " + (P.hasTp ? RxaPx(P.tp) : "-");
        }
     }
   if(InpArrShowConfirm && gRxa.hasConfirm)
     {
      RxConfirm K = gRxa.conf;
      color cc = K.zone.dir > 0 ? InpDemandLine : InpSupplyLine;
      string ct = StringFormat("%s CONFIRMATION: a %s arrival %s inside the realignment area - the %s", ltn, ltn, RxaZTxt(K.zone), K.zone.dir > 0 ? "buy" : "sell");
      RxaBox(RXA_PFX + "cz", K.zone.baseStart, K.zone.prox, right, K.zone.dist, cc, STYLE_SOLID, 2, false, ct);
      RxaText(RXA_PFX + "czt", K.zone.baseStart, K.zone.dist, ltn + " CONFIRMATION " + (K.zone.dir > 0 ? "BUY" : "SELL") + (K.inArea ? " (price in the area)" : ""), cc, 8,
              K.zone.dir > 0 ? ANCHOR_LEFT_UPPER : ANCHOR_LEFT_LOWER, true, ct);
      datetime tc = K.zone.made;
      RxaHL(RXA_PFX + "ce", tc, right, K.entry, cc, STYLE_SOLID, ltn + " entry " + RxaPx(K.entry), ct);
      RxaHL(RXA_PFX + "cs", tc, right, K.stop, clrRed, STYLE_DASH, ltn + " SL " + RxaPx(K.stop) + (K.basis == 1 ? " (realign zone)" : " (valley)"), "Stop rule on the " + ltn + " (host = the realignment zone)");
      if(K.hasTarget) RxaHL(RXA_PFX + "ct", tc, right, K.target, clrForestGreen, STYLE_DASH, ltn + " target " + RxaPx(K.target) + (K.hasRR ? StringFormat(" 1:%.1f", K.rr) : ""), "Target: the " + tfn + " newest real " + (K.zone.dir > 0 ? "peak's high" : "valley's low"));
      sum += " | " + ltn + " CONFIRMED " + (K.zone.dir > 0 ? "buy " : "sell ") + RxaPx(K.entry);
     }
   string sn = RXA_PFX + "sum";
   ObjectCreate(0, sn, OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, sn, OBJPROP_CORNER, CORNER_LEFT_LOWER); ObjectSetInteger(0, sn, OBJPROP_ANCHOR, ANCHOR_LEFT_LOWER);
   ObjectSetInteger(0, sn, OBJPROP_XDISTANCE, 8); ObjectSetInteger(0, sn, OBJPROP_YDISTANCE, 58);
   ObjectSetString(0, sn, OBJPROP_TEXT, sum); ObjectSetString(0, sn, OBJPROP_FONT, "Arial"); ObjectSetInteger(0, sn, OBJPROP_FONTSIZE, 8);
   ObjectSetInteger(0, sn, OBJPROP_COLOR, InpMuted); ObjectSetInteger(0, sn, OBJPROP_SELECTABLE, false);
  }
// new arrival / LTF confirmation: once each (never for what is already on the chart when it loads)
void RxaAlerts(double bid)
  {
   string tfn = RxTfName(gRxa.tf), ltn = gRxa.ltf > 0 ? RxTfName(gRxa.ltf) : "LTF";
   if(gRxa.cur >= 0)
     {
      RxArrival A = gRxa.arr[gRxa.cur];
      string key = "A|" + tfn + "|" + IntegerToString((long)A.zone.tLeg);
      if(!RxaSeen(key))
        {
         RxaMark(key);
         if(gRxaArmed && InpArrAlertNew)
            RxaNotify(StringFormat("ZoneVision %s %s: new %sARRIVAL %s (leg-out crossed the %s trend line, %d opposite zone(s) removed)%s", _Symbol, tfn, A.strong ? "STRONG " : "", RxaZTxt(A.zone), tfn, A.nRem,
                                   gRxa.hasPlan ? " | entry " + RxaPx(gRxa.plan.entry) + " SL " + RxaPx(gRxa.plan.stop) + (gRxa.plan.hasTp ? " TP " + RxaPx(gRxa.plan.tp) : "") : ""));
        }
     }
   if(gRxa.hasConfirm)
     {
      string key = "C|" + ltn + "|" + IntegerToString((long)gRxa.conf.zone.tLeg);
      if(!RxaSeen(key))
        {
         RxaMark(key);
         if(gRxaArmed && InpArrAlertConfirm)
            RxaNotify(StringFormat("ZoneVision %s %s: %s CONFIRMATION %s inside the realignment area | entry %s SL %s%s", _Symbol, tfn, ltn, gRxa.conf.zone.dir > 0 ? "BUY" : "SELL", RxaPx(gRxa.conf.entry), RxaPx(gRxa.conf.stop),
                                   gRxa.conf.hasTarget ? " target " + RxaPx(gRxa.conf.target) : ""));
        }
     }
   gRxaRKey = "";
   if(gRxa.hasPlan && gRxa.plan.realign >= 0)
     {
      RxZone z = gRxa.zones[gRxa.plan.realign];
      gRxaRLo = RxLo(z); gRxaRHi = RxHi(z); gRxaRKey = "R|" + tfn + "|" + IntegerToString((long)z.tLeg);
      gRxaRTxt = StringFormat("ZoneVision %s %s: price entered the realignment area %s - wait for a %s arrival inside it", _Symbol, tfn, RxaZTxt(z), ltn);
      if(!gRxaArmed) gRxaIn = bid >= gRxaRLo && bid <= gRxaRHi;      // already inside at load: no alert
     }
  }
void RxaRealignTick()
  {
   if(gRxaRKey == "") { gRxaIn = false; return; }
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   bool in = bid >= gRxaRLo && bid <= gRxaRHi;
   if(in && !gRxaIn && !RxaSeen(gRxaRKey)) { RxaMark(gRxaRKey); if(gRxaArmed && InpArrAlertRealign) RxaNotify(gRxaRTxt); }
   gRxaIn = in;
  }
// ==== RFX_ARRIVAL_CHART END ====

int OnInit() { gRxaT0 = 0; gRxaArmed = false; return(INIT_SUCCEEDED); }
void OnDeinit(const int r) { ObjectsDeleteAll(0, PFX); ObjectsDeleteAll(0, "RFXN_"); ObjectsDeleteAll(0, "RFXP2_"); ObjectsDeleteAll(0, RXA_PFX); Comment(""); }

// Click a zone (box, name or its lines) -> a details box right beside the click; click anywhere else to close it
string zKey[], zTxt[]; uint popAt = 0;
void RegZone(string id, string txt) { int n = ArraySize(zKey); ArrayResize(zKey, n + 1); ArrayResize(zTxt, n + 1); zKey[n] = id; zTxt[n] = txt; }
void HidePop() { if(ObjectFind(0, "RFXP2_bg") >= 0) { ObjectsDeleteAll(0, "RFXP2_"); ChartRedraw(); } }
void ShowPop(string txt, int x, int y)
  {
   ObjectsDeleteAll(0, "RFXP2_");
   string ln[]; int n = StringSplit(txt, '\n', ln), w = 0;
   for(int i = 0; i < n; i++) w = MathMax(w, StringLen(ln[i]));
   int bw = MathMax(240, w * 6 + 24), bh = 15 * n + 12;
   int cw = (int)ChartGetInteger(0, CHART_WIDTH_IN_PIXELS), ch = (int)ChartGetInteger(0, CHART_HEIGHT_IN_PIXELS);
   int bx = x + 18 + bw > cw ? MathMax(4, x - 18 - bw) : x + 18, by = MathMax(4, MathMin(y - bh / 2, ch - bh - 4));
   ObjectCreate(0, "RFXP2_bg", OBJ_RECTANGLE_LABEL, 0, 0, 0);
   ObjectSetInteger(0, "RFXP2_bg", OBJPROP_XDISTANCE, bx); ObjectSetInteger(0, "RFXP2_bg", OBJPROP_YDISTANCE, by);
   ObjectSetInteger(0, "RFXP2_bg", OBJPROP_XSIZE, bw); ObjectSetInteger(0, "RFXP2_bg", OBJPROP_YSIZE, bh);
   ObjectSetInteger(0, "RFXP2_bg", OBJPROP_BGCOLOR, C'255,255,236'); ObjectSetInteger(0, "RFXP2_bg", OBJPROP_BORDER_TYPE, BORDER_FLAT);
   ObjectSetInteger(0, "RFXP2_bg", OBJPROP_COLOR, clrDarkGray); ObjectSetInteger(0, "RFXP2_bg", OBJPROP_BACK, false);
   for(int i = 0; i < n; i++)
     {
      string nm = "RFXP2_" + IntegerToString(i);
      ObjectCreate(0, nm, OBJ_LABEL, 0, 0, 0);
      ObjectSetInteger(0, nm, OBJPROP_XDISTANCE, bx + 8); ObjectSetInteger(0, nm, OBJPROP_YDISTANCE, by + 6 + 15 * i);
      ObjectSetString(0, nm, OBJPROP_TEXT, ln[i]); ObjectSetString(0, nm, OBJPROP_FONT, "Arial"); ObjectSetInteger(0, nm, OBJPROP_FONTSIZE, 8);
      color c = clrDimGray;
      if(StringFind(ln[i], "x ") == 0) c = clrFireBrick;
      if(StringFind(ln[i], "+ ") == 0) c = clrSeaGreen;
      if(i <= 1) c = clrBlack;
      ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
     }
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
void OnChartEvent(const int id, const long &lparam, const double &dparam, const string &sparam)
  {
   if(id == CHARTEVENT_OBJECT_CLICK)
     {
      for(int i = 0; i < ArraySize(zKey); i++)
         if(sparam == zKey[i] || sparam == zKey[i] + "n" || sparam == zKey[i] + "p" || sparam == zKey[i] + "d") { ShowPop(zTxt[i], (int)lparam, (int)dparam); return; }
      HidePop();
      return;
     }
   if(id == CHARTEVENT_CLICK && GetTickCount() - popAt > 300) HidePop();   // a click on empty chart closes it
  }

int OnCalculate(const int rates_total, const int prev_calculated, const datetime &time[], const double &open[], const double &high[],
                const double &low[], const double &close[], const long &tick_volume[], const long &volume[], const int &spread[])
  {
   static datetime lastPanel = 0;
   if(Time[0] == lastDraw && prev_calculated > 0)
     {
      if(TimeLocal() - lastPanel >= 5) { lastPanel = TimeLocal(); Panel(); }   // light refresh between candles
      static datetime lastNotes = 0;
      if(InpShowBotOrders && TimeLocal() - lastNotes >= 20) { lastNotes = TimeLocal(); BotNotes(); }   // bot notes file read every 20s
      RxaTick(false);                                                // 2.00 arrival: re-read only when a chart / HTF / LTF bar opened
      return rates_total;
     }
   lastDraw = Time[0];
   ObjectsDeleteAll(0, PFX);
   ArrayResize(zKey, 0); ArrayResize(zTxt, 0);
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
   NoSelect(PFX); NoSelect("RFXN_");
   RxaTick(false);
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
// HTF line on this chart, the way you refine it going down the timeframes:
//  1) anchor = this chart's candle holding the extreme inside the HTF anchor bar;
//  2) touch = the candle (up to the HTF pivot) that keeps every candle between on the right side - no cut candles;
//  3) walk forward on THIS chart: a later swing that pokes beyond the line becomes the new touch; the walk stops at the
//     first full candle beyond the line (the break on this chart), so later rallies never flatten the line.
// ce = this chart's break bar (-1 = still respected here). false when the history does not reach the anchor.
bool RefineOnChart(int d, int aH, int bH, int endH, int &ca, int &cb, double &csl, int &ce)
  {
   ca = ChartBarIn(d, aH); int ph = ChartBarIn(d, bH); ce = -1;
   if(ca < 0 || ph < 0 || ph >= ca) return false;
   double pa = d > 0 ? Low[ca] : High[ca];
   cb = -1; csl = 0;
   for(int j = ca - 1; j >= ph; j--)
     {
      double s0 = ((d > 0 ? Low[j] : High[j]) - pa) / (ca - j);
      if((d > 0 && s0 <= 0) || (d < 0 && s0 >= 0)) continue;
      if(cb < 0 || (d > 0 ? s0 < csl : s0 > csl)) { cb = j; csl = s0; }
     }
   if(cb < 0) return false;
   int keep = gTF; gTF = _Period;
   int stop = endH >= 0 ? MathMax(1, iBarShift(NULL, 0, iTime(NULL, keep, endH)) - 1) : 1;
   for(int j = ph - 1; j >= 1; j--)
     {
      double lv = (d > 0 ? Low[cb] : High[cb]) + csl * (cb - j);
      if((d > 0 && High[j] < lv) || (d < 0 && Low[j] > lv)) { ce = j; break; }            // a full candle beyond: broken here
      if(j < stop) break;
      if(j > InpTLSwing && (d > 0 ? FrLow(j) : FrHigh(j)) && (d > 0 ? Low[j] < lv : High[j] > lv))
        {
         double s0 = ((d > 0 ? Low[j] : High[j]) - pa) / (ca - j);
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
// Kevin: a near-horizontal line is not a trendline - and not a momentum line: flat = NO line. Needs a visible angle.
bool TooFlat(int a, int b2, double p2, double sl)
  {
   double atr = MathMax(iATR(NULL, gTF, 14, b2), Point);
   return MathAbs(sl) < 0.015 * atr || MathAbs(p2 - LineAt(p2, b2, sl, a)) < 1.5 * atr;
  }

// Kevin's lines: every real valley (peak) gets a line from the previous real one - or, if that is too flat, from the
// original starting point of the current line, else from the lowest (highest) point before it. Each line is drawn until a full candle closes beyond it, then ended there.
// Plus the overall line from the very bottom (top) of the move, when it has a real angle. Near-flat lines are dropped.
// owner rule (InpTLTwoPivot): zvTrend.ts zvLines lines 102-134 - the two most recent real valleys (up) / peaks (down),
// newer higher / lower, FitAnchor (wick re-anchoring), not TooFlat (flat = no line), Confirmed; RemovedAt marks a broken
// line (kept for TLBias, not drawn)
void TwoPivotLines()
  {
   for(int d = -1; d <= 1; d += 2)
     {
      int want = d > 0 ? -1 : 1, io = -1, inw = -1;
      for(int k = 0; k < ArraySize(pvBar); k++) if(pvT[k] == want) { io = inw; inw = k; }
      if(io < 0) continue;
      int b2 = pvBar[inw]; double p2 = pvP[inw], sl = 0;
      if(d > 0 ? !(p2 > pvP[io]) : !(p2 < pvP[io])) continue;
      int a = FitAnchor(pvBar[io], b2, p2, d, sl);
      double pa = d > 0 ? Lo(a) : Hi(a);
      if(d > 0 ? !(p2 > pa) : !(p2 < pa)) continue;
      if(TooFlat(a, b2, p2, sl)) continue;
      if(!Confirmed(a, b2, p2, sl, d)) continue;
      AddTL(d, a, b2, p2, sl, false);
     }
  }
void Trendlines(string s, int tf)
  {
   ArrayResize(TL, 0); gUpOn = false; gDnOn = false;
   int bars = MathMin(InpLookback, iBars(NULL, gTF) - 20);
   ZigZag(bars);
   if(InpTLTwoPivot) TwoPivotLines();
   for(int d = -1; d <= 1 && !InpTLTwoPivot; d += 2)                  // 1.99 lines (InpTLTwoPivot = false)
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
         if(InpTLTwoPivot) keep = !TL[i].removed;                       // owner rule: a broken line is not drawn
         if(!keep || shown >= InpTLHistory) continue;
         shown++;
         bool up = d > 0;
         double sl = (TL[i].pb - TL[i].pa) / MathMax(1, TL[i].a - TL[i].b);
         int end = TL[i].removed ? TL[i].removedBar : 0;
         double pe = LineAt(TL[i].pb, TL[i].b, sl, end - (TL[i].removed ? 0 : 3));
         string nm = PFX + "tl" + (gTF == _Period ? "" : "H" + IntegerToString(gTF) + "_") + IntegerToString(i);
         color c = gTF == _Period ? (TL[i].removed ? InpMuted : InpTrend) : (TL[i].removed ? InpHtfTLBroken : InpHtfTL);   // broken: light dotted; respected: thick dark
         datetime x1 = iTime(NULL, gTF, TL[i].a), x2 = TL[i].removed ? iTime(NULL, gTF, end) : iTime(NULL, gTF, 0) + PeriodSeconds(gTF) * 3;
         double y1 = TL[i].pa; datetime rTouch = 0;
         // higher-timeframe line on this chart: re-anchor it on this chart's own candles - the top-most (bottom-most)
         // candle inside each HTF pivot, then moved so it cuts no candle of this chart (clean, exact touch points)
         if(gTF != _Period && InpTLTwoPivot)                             // owner rule: straight, chart candles holding the HTF anchors
           {
            int ca = ChartBarIn(d, TL[i].a), cb = ChartBarIn(d, TL[i].b);
            if(ca >= 0 && cb >= 0 && ca > cb)
              {
               double csl2 = (TL[i].pb - TL[i].pa) / (ca - cb);
               x1 = Time[ca]; y1 = TL[i].pa; x2 = Time[0] + PeriodSeconds() * 3; pe = TL[i].pb + csl2 * (cb + 3); rTouch = Time[cb];
              }
           }
         else if(gTF != _Period && InpRefineHTF)
           {
            int ca, cb, ce; double csl;
            if(RefineOnChart(d, TL[i].a, TL[i].b, TL[i].removed ? TL[i].removedBar : -1, ca, cb, csl, ce))
              {
               double pcb = up ? Low[cb] : High[cb];
               x1 = Time[ca]; y1 = up ? Low[ca] : High[ca];
               if(TL[i].removed && ce < 0) ce = iBarShift(NULL, 0, iTime(NULL, gTF, end));
               if(ce >= 0) { x2 = Time[ce]; pe = pcb + csl * (cb - ce); }
               else { x2 = Time[0] + PeriodSeconds() * 3; pe = pcb + csl * (cb + 3); }
               rTouch = Time[cb];
              }
           }
         datetime tTouch = rTouch > 0 ? rTouch : iTime(NULL, gTF, TL[i].b);
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
   return "no intact trendline";                                       // 2.00: flat / broken = no line (not 'momentum')
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
   int htf = HtfOf(_Period); if(htf <= 0) htf = _Period;
   double xa = MathAbs((Bid + Ask) / 2 - z.prox) / MathMax(iATR(NULL, htf, 14, 1), Point);
   if(xa > InpMaxDistATR) Push(mi, StringFormat("far: %.1f x %s ATR", xa, TfName(htf)));
   int np = ArraySize(pl), nm = ArraySize(mi), nc = ArraySize(cr);
   verdict = nc > 0 ? "WEAK" : ((np >= 5 && nm <= 1) || z.arrival ? "STRONG" : "OK");
   if(nc > 0) shortWhy = cr[0] + (nc > 1 ? ", " + cr[1] : "");
   else if(verdict == "STRONG") shortWhy = pl[0] + (np > 1 ? ", " + pl[1] : "");
   else shortWhy = (nm > 0 ? mi[0] : (np > 0 ? pl[0] : ""));
   // the plan, the way the drills taught it: entry at the proximal, stop past the distal + buffer (x2 gold / oil),
   // target just before the nearest fresh opposing zone
   double spread = Ask - Bid, buf = InpStopBufferPts * Point * (MetalOrOil() ? InpMetalOilStop : 1.0), opp = 0;
   for(int j = 0; j < ArraySize(zs); j++)
     {
      if(zs[j].dir == z.dir || zs[j].removed) continue;
      if(z.dir > 0 && zs[j].prox > z.prox && (opp == 0 || zs[j].prox < opp)) opp = zs[j].prox;
      if(z.dir < 0 && zs[j].prox < z.prox && (opp == 0 || zs[j].prox > opp)) opp = zs[j].prox;
     }
   double en = z.dir > 0 ? z.prox + spread : z.prox, sl = z.dir > 0 ? z.dist - buf : z.dist + buf + spread;
   double tp = opp > 0 ? (z.dir > 0 ? opp - spread : opp + spread) : 0, rr = tp > 0 ? MathAbs(tp - en) / MathMax(MathAbs(en - sl), Point) : 0;
   string grade = nc > 0 ? "C" : ((verdict == "STRONG" && (z.arrival || np >= 6) && rr >= 3) ? "A" : (rr >= InpMinRR && nm <= 2 ? "B" : "C"));
   string why = nc > 0 ? cr[0] : (tp == 0 ? "no opposing zone for a target" : (rr < InpMinRR ? StringFormat("R:R 1:%.1f is below 1:%.1f", rr, InpMinRR) : ""));
   string t = StringFormat("Grade %s | %s | Trade: %s\n", grade, verdict, why == "" ? "YES" : "NO - " + why);
   if(tp > 0) t += StringFormat("Plan: %s %s  SL %s  TP %s  = 1:%.1f\n", z.dir > 0 ? "buy limit" : "sell limit", DoubleToString(en, Digits), DoubleToString(sl, Digits), DoubleToString(tp, Digits), rr);
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
   if(StringLen(t) > 900) t = StringSubstr(t, 0, 895) + "...";        // MT4 tooltips stop at about 1000 characters
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
      ObjectSetString(0, id, OBJPROP_TOOLTIP, htf ? TfName(tf) + " " + ZoneName(z) : ZoneName(z) + " | " + verdict + " - click for details");
      if(!htf) RegZone(id, ZoneName(z) + "\n" + full);
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
         if(!htf) ObjectSetString(0, id + "n", OBJPROP_TOOLTIP, "click for details");
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
   if(InpShowLegend) L += "Key: VP = valley/peak (reversal), CP = continuation, clear space = gap under the stay-away candle,\n      ATR = average candle size, HTF = higher timeframe, x = deal-breaker, - = weakness, + = strength\n";
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
