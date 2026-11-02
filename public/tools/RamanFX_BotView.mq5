//+------------------------------------------------------------------+
//| RamanFX_BotView.mq5 v1.01                                        |
//| Draws on MT5 exactly what the Telegram bot draws: the bot's zones |
//| and live trend lines from its latest hourly scan (Pepperstone     |
//| prices). Nothing is computed here, so the chart always matches    |
//| the bot. An Expert Advisor only because MT5 lets only EAs and     |
//| scripts download (WebRequest); it never trades.                  |
//| Setup once: Tools > Options > Expert Advisors > tick "Allow       |
//| WebRequest for listed URL" and add https://raw.githubusercontent.com |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "1.01"

input string InpSymbol   = "";     // Bot symbol (empty = this chart's symbol, e.g. XAUUSD, US500, Soybeans)
input bool   InpHtf      = true;   // Also the next higher timeframe: nearest zone each side (outline) + its lines (gold dotted)
input bool   InpLabels   = true;   // Small text at each zone's right end (TF, side, fresh / tested)
input int    InpMaxPerSide = 3;    // This timeframe's zones drawn per side (nearest to price)
input int    InpRefreshMin = 5;    // Download the bot's scan every N minutes

#define PFX  "RFXBV_"
#define URL0 "https://raw.githubusercontent.com/r4m4nxd/ramanFX/data/public/fx/mt5/"

string gText = "", gSym = "";
bool   gDark = false;

string TfOf(ENUM_TIMEFRAMES p)
  {
   int s = PeriodSeconds(p);
   if(s >= PeriodSeconds(PERIOD_MN1)) return "MN";
   if(s >= PeriodSeconds(PERIOD_W1)) return "W1";
   if(s >= PeriodSeconds(PERIOD_D1)) return "D1";
   if(s >= PeriodSeconds(PERIOD_H4)) return "H4";
   return "H1";
  }
string HtfOf(string tf) { return tf == "H1" ? "H4" : tf == "H4" ? "D1" : tf == "D1" ? "W1" : tf == "W1" ? "MN" : ""; }
ENUM_TIMEFRAMES PeriodOf(string tf) { return tf == "H1" ? PERIOD_H1 : tf == "H4" ? PERIOD_H4 : tf == "D1" ? PERIOD_D1 : tf == "W1" ? PERIOD_W1 : PERIOD_MN1; }
datetime T(string s) { StringReplace(s, "-", "."); StringReplace(s, "T", " "); return StringToTime(s); }

bool Fetch()
  {
   char post[], res[]; string hdr;
   ResetLastError();
   int code = WebRequest("GET", URL0 + gSym + ".txt", "", 8000, post, res, hdr);
   if(code != 200)
     {
      int e = GetLastError();
      Comment(e == 4014 ? "BotView: allow WebRequest for https://raw.githubusercontent.com (Tools > Options > Expert Advisors)"
                        : StringFormat("BotView: no bot data for %s (HTTP %d) - is it on the bot's watchlist?", gSym, code));
      return false;
     }
   string txt = CharArrayToString(res, 0, WHOLE_ARRAY, CP_UTF8);
   if(txt == gText) return false;
   gText = txt;
   Comment("");
   return true;
  }

void Box(string nm, datetime t1, double p1, datetime t2, double p2, color c, bool fill, int style)
  {
   ObjectCreate(0, nm, OBJ_RECTANGLE, 0, t1, p1, t2, p2);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
   ObjectSetInteger(0, nm, OBJPROP_FILL, fill);
   ObjectSetInteger(0, nm, OBJPROP_BACK, true);
   ObjectSetInteger(0, nm, OBJPROP_STYLE, style);
   ObjectSetInteger(0, nm, OBJPROP_WIDTH, 1);
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, nm, OBJPROP_HIDDEN, true);
  }
void Edge(string nm, datetime t1, datetime t2, double p, color c)
  {
   ObjectCreate(0, nm, OBJ_TREND, 0, t1, p, t2, p);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
   ObjectSetInteger(0, nm, OBJPROP_WIDTH, 1);
   ObjectSetInteger(0, nm, OBJPROP_RAY_RIGHT, false);
   ObjectSetInteger(0, nm, OBJPROP_BACK, true);
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, nm, OBJPROP_HIDDEN, true);
  }
void Label(string nm, datetime t, double p, string txt, color c, int anchor)
  {
   ObjectCreate(0, nm, OBJ_TEXT, 0, t, p);
   ObjectSetString(0, nm, OBJPROP_TEXT, txt);
   ObjectSetString(0, nm, OBJPROP_FONT, "Arial");
   ObjectSetInteger(0, nm, OBJPROP_FONTSIZE, 7);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
   ObjectSetInteger(0, nm, OBJPROP_ANCHOR, anchor);
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, nm, OBJPROP_HIDDEN, true);
  }

// a bot line of timeframe tf: price p on the bar at time t, slope s per tf bar, first anchor n tf bars before t
void Line(string nm, string tf, double p, double s, int n, string t, color c, int style)
  {
   ENUM_TIMEFRAMES pr = PeriodOf(tf);
   int k = iBarShift(_Symbol, pr, T(t), false);
   if(k < 0 || k + n >= iBars(_Symbol, pr)) return;
   datetime t1 = iTime(_Symbol, pr, k + n), t2 = iTime(_Symbol, pr, k);
   ObjectCreate(0, nm, OBJ_TREND, 0, t1, p - s * n, t2, p);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
   ObjectSetInteger(0, nm, OBJPROP_STYLE, style);
   ObjectSetInteger(0, nm, OBJPROP_WIDTH, 1);
   ObjectSetInteger(0, nm, OBJPROP_RAY_RIGHT, true);
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, nm, OBJPROP_HIDDEN, true);
   ObjectSetString(0, nm, OBJPROP_TOOLTIP, tf + (s > 0 ? " up" : " down") + " trend line (bot)");
  }

void Draw()
  {
   ObjectsDeleteAll(0, PFX);
   if(gText == "") { ChartRedraw(); return; }
   gDark = ((color)ChartGetInteger(0, CHART_COLOR_BACKGROUND) & 0xFF) < 128;
   string tf = TfOf((ENUM_TIMEFRAMES)_Period), htf = InpHtf ? HtfOf(tf) : "";
   double px = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   datetime right = iTime(_Symbol, PERIOD_CURRENT, 0) + PeriodSeconds() * 12;
   color dFill = gDark ? C'24,64,40' : C'205,235,210', sFill = gDark ? C'80,32,30' : C'248,215,205';
   color dLine = gDark ? C'80,200,120' : C'46,139,87', sLine = gDark ? C'235,95,95' : C'200,60,60';
   color lineC = gDark ? C'220,220,220' : clrBlack, gold = C'200,150,40', txtC = gDark ? C'150,150,150' : C'110,110,110';
   string rows[];
   int n = StringSplit(gText, '\n', rows);
   // this TF's zones: the nearest InpMaxPerSide each side; the HTF: the nearest one each side
   int cntD = 0, cntS = 0; double bestHD = -1, bestHS = -1; int iHD = -1, iHS = -1;
   string f[];
   // the file lists zones nearest first (the bot's order), so the first ones per side are the nearest
   for(int i = 0; i < n; i++)
     {
      if(StringSplit(rows[i], ';', f) < 7 || f[0] != "Z") continue;
      bool dem = f[2] == "demand";
      double pr = StringToDouble(f[3]), ds = StringToDouble(f[4]);
      if(f[1] == tf)
        {
         if(dem ? cntD >= InpMaxPerSide : cntS >= InpMaxPerSide) continue;
         if(dem) cntD++; else cntS++;
         string nm = PFX + "z" + IntegerToString(i);
         datetime t1 = T(f[5]);
         Box(nm, t1, pr, right, ds, dem ? dFill : sFill, true, STYLE_SOLID);
         Edge(nm + "p", t1, right, pr, dem ? dLine : sLine);
         Edge(nm + "d", t1, right, ds, dem ? dLine : sLine);
         int tch = (int)StringToInteger(f[6]);
         ObjectSetString(0, nm, OBJPROP_TOOLTIP, StringFormat("%s %s %s-%s %s", tf, f[2], f[3], f[4], tch > 0 ? "touched " + IntegerToString(tch) + "x" : "fresh"));
         if(InpLabels) Label(nm + "t", right, dem ? MathMax(pr, ds) : MathMin(pr, ds), StringFormat("%s %s%s", tf, dem ? "demand" : "supply", tch > 0 ? " " + IntegerToString(tch) + "x" : ""),
                             txtC, dem ? ANCHOR_RIGHT_LOWER : ANCHOR_RIGHT_UPPER);
        }
      else if(htf != "" && f[1] == htf)
        {
         double dist = MathAbs(px - pr);
         if(dem && (iHD < 0 || dist < bestHD)) { iHD = i; bestHD = dist; }
         if(!dem && (iHS < 0 || dist < bestHS)) { iHS = i; bestHS = dist; }
        }
     }
   for(int q = 0; q < 2; q++)
     {
      int i = q == 0 ? iHD : iHS;
      if(i < 0 || StringSplit(rows[i], ';', f) < 7) continue;
      bool dem = f[2] == "demand";
      double pr = StringToDouble(f[3]), ds = StringToDouble(f[4]);
      string nm = PFX + "h" + IntegerToString(i);
      Box(nm, T(f[5]), pr, right, ds, dem ? dLine : sLine, false, STYLE_DOT);
      ObjectSetString(0, nm, OBJPROP_TOOLTIP, htf + " " + f[2] + " " + f[3] + "-" + f[4]);
      if(InpLabels) Label(nm + "t", right, dem ? MathMax(pr, ds) : MathMin(pr, ds), htf + " " + f[2], txtC, dem ? ANCHOR_RIGHT_LOWER : ANCHOR_RIGHT_UPPER);
     }
   // live lines only (the bot does not draw crossed ones): this TF solid, the HTF gold dotted
   for(int i = 0; i < n; i++)
     {
      if(StringSplit(rows[i], ';', f) < 9 || f[0] != "L" || f[8] == "1") continue;   // L;tf;dir;p;s;n;t;touches;crossed
      if(f[1] == tf) Line(PFX + "l" + IntegerToString(i), tf, StringToDouble(f[3]), StringToDouble(f[4]), (int)StringToInteger(f[5]), f[6], lineC, STYLE_SOLID);
      else if(htf != "" && f[1] == htf) Line(PFX + "l" + IntegerToString(i), htf, StringToDouble(f[3]), StringToDouble(f[4]), (int)StringToInteger(f[5]), f[6], gold, STYLE_DOT);
     }
   // when the scan was made
   string g[];
   if(n > 0 && StringSplit(rows[0], ';', g) >= 2 && g[0] == "G")
     {
      string nm = PFX + "g";
      ObjectCreate(0, nm, OBJ_LABEL, 0, 0, 0);
      ObjectSetInteger(0, nm, OBJPROP_CORNER, CORNER_LEFT_LOWER);
      ObjectSetInteger(0, nm, OBJPROP_ANCHOR, ANCHOR_LEFT_LOWER);
      ObjectSetInteger(0, nm, OBJPROP_XDISTANCE, 8); ObjectSetInteger(0, nm, OBJPROP_YDISTANCE, 8);
      ObjectSetString(0, nm, OBJPROP_TEXT, "BotView " + gSym + " " + tf + " | bot scan " + StringSubstr(g[1], 0, 16) + " UTC");
      ObjectSetString(0, nm, OBJPROP_FONT, "Arial"); ObjectSetInteger(0, nm, OBJPROP_FONTSIZE, 7);
      ObjectSetInteger(0, nm, OBJPROP_COLOR, txtC); ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
     }
   ChartRedraw();
  }

int OnInit()
  {
   gSym = InpSymbol != "" ? InpSymbol : _Symbol;
   Fetch();
   Draw();
   EventSetTimer(MathMax(1, InpRefreshMin) * 60);
   return(INIT_SUCCEEDED);
  }
void OnDeinit(const int r) { EventKillTimer(); ObjectsDeleteAll(0, PFX); Comment(""); ChartRedraw(); }
void OnTimer() { if(Fetch()) Draw(); }
void OnTick()
  {
   static datetime last = 0;                                 // keep the boxes' right end with the newest bar
   datetime t = iTime(_Symbol, PERIOD_CURRENT, 0);
   if(t != last) { last = t; Draw(); }
  }
void OnChartEvent(const int id, const long &l, const double &d, const string &s) { if(id == CHARTEVENT_CHART_CHANGE) { static string tf0 = ""; string tf = TfOf((ENUM_TIMEFRAMES)_Period); if(tf != tf0) { tf0 = tf; Draw(); } } }
