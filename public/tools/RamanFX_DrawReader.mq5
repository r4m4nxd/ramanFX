//+------------------------------------------------------------------+
//| RamanFX_DrawReader.mq5 v1.02                                     |
//| YOU draw the zones (rectangles) and trend lines. This indicator  |
//| measures each one and writes a short note next to it: what the   |
//| box edges sit on (wick / body), the base, the pattern, how far   |
//| price left, whether it is a swing turn, tests, breaks; for a     |
//| line: what each anchor sits on, candles cut, touches, the break. |
//| Every change is saved to Terminal\Common\Files:                  |
//|   RFX_Drawings_<symbol>_<tf>.csv  (your drawings + the notes)    |
//|   RFX_Bars_<symbol>_<tf>.csv      (the candles)                  |
//| Send those two files: the rules are learned from your drawings.  |
//| Display only. Objects of other RamanFX tools (RFX...) ignored.   |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "1.02"
#property indicator_chart_window
#property indicator_buffers 0
#property indicator_plots   0

input bool   InpNotes     = true;           // Show the notes on the chart (the Why button toggles them)
input double InpTolATR    = 0.10;           // Tolerance: an edge / touch within this x ATR(14) counts
input int    InpBarsSaved = 1500;           // Candles saved to the bars file
input color  InpNoteColor = C'110,110,110'; // Note colour

#define PFX "RFXDR_"
#define BTN "RFXDR_btn"
bool gShow = true;
string gShort = "";   // 1.01: the chart note (MT5 shows ~63 characters of an OBJ_TEXT); the full one is the tooltip
// "wick" / "body" / "~wick" (near) from an EdgeOf text
// a time as a bar shift: 0 = the newest candle, larger = older, negative = to the right of the newest candle (future)
double Shift(datetime t)
  {
   datetime last = iTime(_Symbol, _Period, 0);
   if(t > last) return -(double)(t - last) / PeriodSeconds();
   int s = iBarShift(_Symbol, _Period, t, false);
   return s < 0 ? iBars(_Symbol, _Period) - 1 : s;
  }
string Kind(string e) { if(e == "future") return e; if(StringFind(e, "near ") == 0) return "~" + StringSubstr(e, 5, 4); return StringSubstr(e, 0, 4); }

double H(int s) { return iHigh(_Symbol, _Period, s); }
double L(int s) { return iLow(_Symbol, _Period, s); }
double O(int s) { return iOpen(_Symbol, _Period, s); }
double C(int s) { return iClose(_Symbol, _Period, s); }
datetime T(int s) { return iTime(_Symbol, _Period, s); }
int NB() { return iBars(_Symbol, _Period); }
string D(int s) { return s < 0 ? "-" : TimeToString(T(s), TIME_DATE); }
string TfName() { string t = EnumToString((ENUM_TIMEFRAMES)_Period); return StringSubstr(t, 7); }

// ATR(14) as the plain average range of the 14 candles ending at bar s
double Atr(int s)
  {
   int nb = NB(), k = 0; double sum = 0;
   for(int i = s; i < nb && k < 14; i++, k++) sum += H(i) - L(i);
   return k > 0 ? sum / k : 0;
  }
// swing strength: candles to the left / right before a lower low (lowSide) or a higher high
int Strength(int s, bool lowSide, bool left)
  {
   int n = 0, nb = NB();
   double v = lowSide ? L(s) : H(s);
   if(left) { for(int k = s + 1; k < nb; k++) { if(lowSide ? L(k) < v : H(k) > v) break; n++; } }
   else     { for(int k = s - 1; k >= 0; k--) { if(lowSide ? L(k) < v : H(k) > v) break; n++; } }
   return n;
  }
// what price p sits on among bars sHi..sLo: "wick" or "body" (top side = highs, else lows), the bar, the miss in ATR
string EdgeOf(int sHi, int sLo, double p, bool top, double atr, int &bar)
  {
   double best = DBL_MAX; string kind = "";
   bar = -1;
   for(int s = sHi; s >= sLo; s--)
     {
      if(s < 0 || s >= NB()) continue;
      double w = top ? H(s) : L(s), b = top ? MathMax(O(s), C(s)) : MathMin(O(s), C(s));
      if(MathAbs(w - p) < best) { best = MathAbs(w - p); kind = "wick"; bar = s; }
      if(MathAbs(b - p) < best) { best = MathAbs(b - p); kind = "body"; bar = s; }
     }
   if(bar < 0) return "?";
   double m = best / atr;
   return (m <= InpTolATR ? kind : "near " + kind) + " " + D(bar) + (m > InpTolATR ? StringFormat(" (%.2f ATR off)", m) : "");
  }

//--- a rectangle you drew
string ZoneNote(string nm, string &row, datetime &tAt, double &pAt, int &anchor)
  {
   datetime ta = (datetime)ObjectGetInteger(0, nm, OBJPROP_TIME, 0), tb = (datetime)ObjectGetInteger(0, nm, OBJPROP_TIME, 1);
   double pa = ObjectGetDouble(0, nm, OBJPROP_PRICE, 0), pb = ObjectGetDouble(0, nm, OBJPROP_PRICE, 1);
   datetime tl = ta < tb ? ta : tb;
   double hi = MathMax(pa, pb), lo = MathMin(pa, pb);
   int nb = NB(), s0 = iBarShift(_Symbol, _Period, tl, false);
   if(s0 < 0 || hi <= lo) return "";
   double atr = Atr(s0); if(atr <= 0) return "";
   double tol = InpTolATR * atr;
   // base: the candles from the left edge that overlap the box
   int n = 0;
   for(int s = s0; s >= 0 && n < 15; s--) { if(L(s) <= hi + tol && H(s) >= lo - tol) n++; else break; }
   if(n == 0) n = 1;
   int sEnd = s0 - n + 1;
   // direction: the first close outside the box from the left edge on
   int dir = 0, sOut = -1;
   for(int s = s0; s >= 0; s--) { if(C(s) > hi + tol) { dir = 1; sOut = s; break; } if(C(s) < lo - tol) { dir = -1; sOut = s; break; } }
   // leg-in: the last close outside the box before it
   int legIn = 0;
   for(int k = s0 + 1; k < nb && k <= s0 + 20; k++) { if(C(k) > hi + tol) { legIn = -1; break; } if(C(k) < lo - tol) { legIn = 1; break; } }
   string pat = "?";
   if(dir > 0) pat = legIn < 0 ? "DBR" : (legIn > 0 ? "RBR" : "?BR");
   if(dir < 0) pat = legIn > 0 ? "RBD" : (legIn < 0 ? "DBD" : "?BD");
   // leg-out: how far price went before it first came back
   double ext = 0; int sRet = -1, legBars = 0;
   if(sOut >= 0)
      for(int s = sOut; s >= 0; s--)
        {
         if(s < sOut && (dir > 0 ? L(s) <= hi : H(s) >= lo)) { sRet = s; break; }
         ext = MathMax(ext, dir > 0 ? H(s) - hi : lo - L(s)); legBars++;
        }
   // tests after that, the deepest one, the break (a close beyond the far edge)
   int touches = 0, sBrk = -1; bool inside = false; double deep = 0;
   if(sRet >= 0)
      for(int s = sRet; s >= 0; s--)
        {
         bool ov = L(s) <= hi && H(s) >= lo;
         if(ov && !inside) touches++;
         inside = ov;
         if(ov) deep = MathMax(deep, dir > 0 ? (hi - L(s)) / (hi - lo) : (H(s) - lo) / (hi - lo));
         if(dir > 0 ? C(s) < lo : C(s) > hi) { sBrk = s; break; }
        }
   // swing turn: the extreme candle of the base, how many candles each side it stays the extreme
   int sx = s0;
   for(int s = s0; s >= sEnd; s--) if(dir < 0 ? H(s) > H(sx) : L(s) < L(sx)) sx = s;
   int swL = Strength(sx, dir >= 0, true), swR = Strength(sx, dir >= 0, false);
   // what the edges sit on (the base candles and 2 either side)
   int bt = -1, bb = -1;
   string eTop = EdgeOf(MathMin(s0 + 2, nb - 1), MathMax(sEnd - 2, 0), hi, true, atr, bt);
   string eBot = EdgeOf(MathMin(s0 + 2, nb - 1), MathMax(sEnd - 2, 0), lo, false, atr, bb);
   string state = sBrk >= 0 ? "broken " + D(sBrk) : (touches > 0 ? StringFormat("tested x%d, deepest %d%%", touches, (int)MathRound(MathMin(deep, 1.0) * 100)) : "fresh");
   string kind = dir > 0 ? "Demand" : (dir < 0 ? "Supply" : "Zone (price never left)");
   string note = StringFormat("%s %s | base %d (%s) | top: %s | bottom: %s | turn %d left / %d right | out %.1f ATR in %d | h %.1f ATR | %s",
                              kind, pat, n, D(s0), eTop, eBot, swL, swR, ext / atr, legBars, (hi - lo) / atr, state);
   row = StringFormat("ZONE;%s;%s;%s;%s;%s;%d;%s;%d;%s;%s;%d;%d;%.2f;%d;%.2f;%d;%s;%s", nm, TimeToString(tl), DoubleToString(hi, _Digits), DoubleToString(lo, _Digits),
                      kind, dir, pat, n, eTop, eBot, swL, swR, ext / atr, legBars, (hi - lo) / atr, touches, D(sBrk), D(s0));
   gShort = StringFormat("%s %s b%d | top %s | bot %s | turn %d/%d | %s", dir > 0 ? "D" : (dir < 0 ? "S" : "?"), pat, n, Kind(eTop), Kind(eBot), swL, swR,
                         sBrk >= 0 ? "broken" : (touches > 0 ? "tested " + IntegerToString(touches) : "fresh"));
   tAt = tl; pAt = dir < 0 ? hi : lo; anchor = dir < 0 ? ANCHOR_LEFT_LOWER : ANCHOR_LEFT_UPPER;
   return note;
  }

//--- a trend line you drew
string LineNote(string nm, string &row, datetime &tAt, double &pAt, int &anchor)
  {
   datetime ta = (datetime)ObjectGetInteger(0, nm, OBJPROP_TIME, 0), tb = (datetime)ObjectGetInteger(0, nm, OBJPROP_TIME, 1);
   double pa = ObjectGetDouble(0, nm, OBJPROP_PRICE, 0), pb = ObjectGetDouble(0, nm, OBJPROP_PRICE, 1);
   if(ta > tb) { datetime t = ta; ta = tb; tb = t; double p = pa; pa = pb; pb = p; }
   // 1.02: bar positions as numbers, so an anchor to the right of the last candle (future) works (negative = future)
   double s0 = Shift(ta), s1 = Shift(tb);
   if(s0 <= s1) { gShort = "line: both points on one candle"; row = "LINE;" + nm + ";same candle"; tAt = tb; pAt = pb; anchor = ANCHOR_LEFT_UPPER; return gShort; }
   bool up = pb > pa;
   double slope = (pb - pa) / (s0 - s1), atr = Atr(MathMax((int)MathRound(s1), 0));
   if(atr <= 0) return "";
   double tol = InpTolATR * atr;
   int i0 = (int)MathRound(s0), i1 = (int)MathRound(s1);
   int b0 = -1, b1 = -1;
   string a0 = EdgeOf(i0 + 1, MathMax(i0 - 1, 0), pa, !up, atr, b0);
   string a1 = i1 >= 0 ? EdgeOf(i1 + 1, MathMax(i1 - 1, 0), pb, !up, atr, b1) : "future";
   int sw0 = b0 >= 0 ? MathMin(Strength(b0, up, true), Strength(b0, up, false)) : 0;
   int sw1 = b1 >= 0 ? MathMin(Strength(b1, up, true), Strength(b1, up, false)) : 0;
   // candles the line cuts between the anchors
   int bodyCut = 0, wickCut = 0;
   for(int s = i0 - 1; s > i1 && s >= 0; s--)
     {
      double v = pa + slope * (s0 - s);
      if(up) { if(MathMin(O(s), C(s)) < v - tol) bodyCut++; else if(L(s) < v - tol) wickCut++; }
      else   { if(MathMax(O(s), C(s)) > v + tol) bodyCut++; else if(H(s) > v + tol) wickCut++; }
     }
   // after anchor 2: touches, the first wick poke, the first close beyond (the break)
   int touches = 0, sPoke = -1, sBrk = -1; bool was = false;
   for(int s = i1 - 1; s >= 0; s--)
     {
      double v = pa + slope * (s0 - s);
      double near = up ? L(s) : H(s);
      if(up ? C(s) < v - tol : C(s) > v + tol) { sBrk = s; break; }
      if(sPoke < 0 && (up ? L(s) < v - tol : H(s) > v + tol)) sPoke = s;
      bool t = MathAbs(near - v) <= tol || (up ? L(s) < v : H(s) > v);
      if(t && !was && s < i1 - 1) touches++;
      was = t;
     }
   string brk = sBrk >= 0 ? "broken " + D(sBrk) + " (close)" + (sPoke >= 0 && sPoke > sBrk ? ", poke " + D(sPoke) : "") : (sPoke >= 0 ? "poked " + D(sPoke) + ", no close beyond" : "intact");
   string note = StringFormat("%s line | A1: %s, turn %d | A2: %s, turn %d | %d bars apart | cuts %d bodies, %d wicks | touches after A2: %d | %s | slope %.2f ATR/bar",
                              up ? "Up" : "Down", a0, sw0, a1, sw1, (int)MathRound(s0 - s1), bodyCut, wickCut, touches, brk, MathAbs(slope) / atr);
   row = StringFormat("LINE;%s;%s;%s;%s;%s;%s;%s;%d;%s;%d;%d;%d;%d;%d;%s;%s;%.3f", nm, TimeToString(ta), DoubleToString(pa, _Digits), TimeToString(tb), DoubleToString(pb, _Digits),
                      up ? "up" : "down", a0, sw0, a1, sw1, (int)MathRound(s0 - s1), bodyCut, wickCut, touches, D(sPoke), D(sBrk), MathAbs(slope) / atr);
   gShort = StringFormat("%s | A1 %s t%d | A2 %s t%d | cuts %d/%d | %s", up ? "Up" : "Dn", Kind(a0), sw0, Kind(a1), sw1, bodyCut, wickCut,
                         sBrk >= 0 ? "broken" : (sPoke >= 0 ? "poked" : "intact"));
   tAt = tb; pAt = pb; anchor = up ? ANCHOR_LEFT_UPPER : ANCHOR_LEFT_LOWER;
   return note;
  }

void Note(string id, datetime t, double p, string txt, int anchor)
  {
   string nm = PFX + id;
   string shown = gShort;
   ObjectCreate(0, nm, OBJ_TEXT, 0, t, p);
   ObjectSetString(0, nm, OBJPROP_TEXT, shown);
   ObjectSetString(0, nm, OBJPROP_FONT, "Arial");
   ObjectSetInteger(0, nm, OBJPROP_FONTSIZE, 7);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, InpNoteColor);
   ObjectSetInteger(0, nm, OBJPROP_ANCHOR, anchor);
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, nm, OBJPROP_HIDDEN, true);
   ObjectSetString(0, nm, OBJPROP_TOOLTIP, txt);
   if(!gShow) ObjectSetInteger(0, nm, OBJPROP_TIMEFRAMES, OBJ_NO_PERIODS);
  }

void Button()
  {
   if(ObjectFind(0, BTN) < 0)
     {
      ObjectCreate(0, BTN, OBJ_BUTTON, 0, 0, 0);
      ObjectSetInteger(0, BTN, OBJPROP_CORNER, CORNER_LEFT_LOWER);
      ObjectSetInteger(0, BTN, OBJPROP_XDISTANCE, 290);
      ObjectSetInteger(0, BTN, OBJPROP_YDISTANCE, 30);
      ObjectSetInteger(0, BTN, OBJPROP_XSIZE, 80);
      ObjectSetInteger(0, BTN, OBJPROP_YSIZE, 22);
      ObjectSetString(0, BTN, OBJPROP_FONT, "Arial");
      ObjectSetInteger(0, BTN, OBJPROP_FONTSIZE, 8);
      ObjectSetInteger(0, BTN, OBJPROP_SELECTABLE, false);
      ObjectSetInteger(0, BTN, OBJPROP_HIDDEN, true);
      ObjectSetInteger(0, BTN, OBJPROP_COLOR, clrWhite);
     }
   ObjectSetString(0, BTN, OBJPROP_TEXT, gShow ? "Why: ON" : "Why: OFF");
   ObjectSetInteger(0, BTN, OBJPROP_STATE, false);
   ObjectSetInteger(0, BTN, OBJPROP_BGCOLOR, gShow ? C'60,90,160' : C'70,70,70');
   ObjectSetInteger(0, BTN, OBJPROP_BORDER_COLOR, gShow ? C'60,90,160' : C'70,70,70');
  }

void SaveBars()
  {
   int h = FileOpen("RFX_Bars_" + _Symbol + "_" + TfName() + ".csv", FILE_WRITE | FILE_TXT | FILE_ANSI | FILE_COMMON);
   if(h == INVALID_HANDLE) return;
   FileWriteString(h, "time;open;high;low;close\r\n");
   for(int s = MathMin(InpBarsSaved, NB()) - 1; s >= 0; s--)
      FileWriteString(h, TimeToString(T(s)) + ";" + DoubleToString(O(s), _Digits) + ";" + DoubleToString(H(s), _Digits) + ";" +
                         DoubleToString(L(s), _Digits) + ";" + DoubleToString(C(s), _Digits) + "\r\n");
   FileClose(h);
  }

void Refresh()
  {
   ObjectsDeleteAll(0, PFX + "n");
   string rows = "";
   int k = 0;
   for(int i = ObjectsTotal(0, 0, -1) - 1; i >= 0; i--)
     {
      string nm = ObjectName(0, i, 0, -1);
      if(StringFind(nm, "RFX") >= 0) continue;                       // other RamanFX tools' objects
      ENUM_OBJECT ty = (ENUM_OBJECT)ObjectGetInteger(0, nm, OBJPROP_TYPE);
      if(ty != OBJ_RECTANGLE && ty != OBJ_TREND && ty != OBJ_TRENDBYANGLE) continue;
      string row = ""; datetime t = 0; double p = 0; int anc = 0;
      string note = ty == OBJ_RECTANGLE ? ZoneNote(nm, row, t, p, anc) : LineNote(nm, row, t, p, anc);
      if(note == "" && ty != OBJ_RECTANGLE)                             // 1.02: never silent on a line
        {
         t = (datetime)ObjectGetInteger(0, nm, OBJPROP_TIME, 1); p = ObjectGetDouble(0, nm, OBJPROP_PRICE, 1); anc = ANCHOR_LEFT_UPPER;
         note = gShort = "line: could not read (" + nm + ")";
        }
      if(note == "") continue;
      rows += row + "\r\n";
      if(InpNotes) Note("n" + IntegerToString(k), t, p, note, anc);
      k++;
     }
   int h = FileOpen("RFX_Drawings_" + _Symbol + "_" + TfName() + ".csv", FILE_WRITE | FILE_TXT | FILE_ANSI | FILE_COMMON);
   if(h != INVALID_HANDLE)
     {
      FileWriteString(h, "# " + _Symbol + " " + TfName() + " saved " + TimeToString(TimeCurrent()) + "\r\n");
      FileWriteString(h, "# ZONE;name;left;top;bottom;kind;dir;pattern;base;top_on;bottom_on;turn_left;turn_right;out_atr;out_bars;height_atr;tests;broken;base_start\r\n");
      FileWriteString(h, "# LINE;name;t1;p1;t2;p2;dir;a1_on;a1_turn;a2_on;a2_turn;bars;body_cuts;wick_cuts;touches;poke;broken;slope_atr\r\n");
      FileWriteString(h, rows);
      FileClose(h);
     }
   SaveBars();
   Button();
   ChartRedraw();
  }

int OnInit()
  {
   gShow = InpNotes;
   ChartSetInteger(0, CHART_EVENT_OBJECT_CREATE, true);
   ChartSetInteger(0, CHART_EVENT_OBJECT_DELETE, true);
   Refresh();
   return(INIT_SUCCEEDED);
  }

void OnDeinit(const int r) { ObjectsDeleteAll(0, PFX); ChartRedraw(); }

void OnChartEvent(const int id, const long &lparam, const double &dparam, const string &sparam)
  {
   if(id == CHARTEVENT_OBJECT_CLICK && sparam == BTN)
     {
      gShow = !gShow;
      for(int i = ObjectsTotal(0, 0, -1) - 1; i >= 0; i--)
        {
         string nm = ObjectName(0, i, 0, -1);
         if(StringFind(nm, PFX + "n") == 0) ObjectSetInteger(0, nm, OBJPROP_TIMEFRAMES, gShow ? OBJ_ALL_PERIODS : OBJ_NO_PERIODS);
        }
      Button(); ChartRedraw();
      return;
     }
   if(StringFind(sparam, PFX) == 0) return;
   if(id == CHARTEVENT_OBJECT_CREATE || id == CHARTEVENT_OBJECT_CHANGE || id == CHARTEVENT_OBJECT_DRAG || id == CHARTEVENT_OBJECT_DELETE)
      Refresh();
  }

int OnCalculate(const int rates_total, const int prev_calculated, const datetime &time[], const double &open[],
                const double &high[], const double &low[], const double &close[], const long &tick_volume[],
                const long &volume[], const int &spread[])
  {
   static int last = 0;
   if(rates_total != last) { last = rates_total; Refresh(); }
   return(rates_total);
  }
