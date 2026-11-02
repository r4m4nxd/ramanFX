//+------------------------------------------------------------------+
//| RamanFX_ChannelMid.mq5 v1.00                                     |
//| Draw a channel with MT5's own Equidistant Channel tool (toolbar   |
//| or Insert > Objects > Channels). This indicator adds a dotted 50%|
//| line inside every channel and keeps it in place when you move,   |
//| stretch or delete the channel. Display only.                     |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "1.00"
#property indicator_chart_window
#property indicator_buffers 0
#property indicator_plots   0

input color InpMidColor = clrNONE;    // 50% line colour (none = the channel's colour)
input int   InpMidStyle = STYLE_DOT;  // 50% line style (2 = dotted, 1 = dashed, 0 = solid)
input int   InpMidWidth = 1;          // 50% line width
input bool  InpMidLabel = false;      // Small "50%" text at the line's right end

#define MID_SFX "_RFXmid"

bool IsMid(string nm) { return StringFind(nm, MID_SFX) > 0; }

// the dotted 50% line of channel ch: halfway between its two lines at both anchor times
void MidUpdate(string ch)
  {
   string mid = ch + MID_SFX, lab = mid + "t";
   if(ObjectFind(0, ch) < 0 || (ENUM_OBJECT)ObjectGetInteger(0, ch, OBJPROP_TYPE) != OBJ_CHANNEL)
     { ObjectDelete(0, mid); ObjectDelete(0, lab); return; }
   datetime t0 = (datetime)ObjectGetInteger(0, ch, OBJPROP_TIME, 0);
   datetime t1 = (datetime)ObjectGetInteger(0, ch, OBJPROP_TIME, 1);
   if(t0 == t1) return;
   // line 0 = the main line, line 1 = the parallel one; the value by time follows the chart's own bar spacing
   double a0 = ObjectGetValueByTime(0, ch, t0, 0), b0 = ObjectGetValueByTime(0, ch, t0, 1);
   double a1 = ObjectGetValueByTime(0, ch, t1, 0), b1 = ObjectGetValueByTime(0, ch, t1, 1);
   if(a0 == 0 || b0 == 0 || a1 == 0 || b1 == 0) return;
   double m0 = (a0 + b0) / 2, m1 = (a1 + b1) / 2;
   if(ObjectFind(0, mid) < 0)
     {
      ObjectCreate(0, mid, OBJ_TREND, 0, t0, m0, t1, m1);
      ObjectSetInteger(0, mid, OBJPROP_SELECTABLE, false);
      ObjectSetInteger(0, mid, OBJPROP_HIDDEN, true);
      ObjectSetInteger(0, mid, OBJPROP_BACK, false);
     }
   else
     {
      ObjectMove(0, mid, 0, t0, m0);
      ObjectMove(0, mid, 1, t1, m1);
     }
   color c = InpMidColor == clrNONE ? (color)ObjectGetInteger(0, ch, OBJPROP_COLOR) : InpMidColor;
   ObjectSetInteger(0, mid, OBJPROP_COLOR, c);
   ObjectSetInteger(0, mid, OBJPROP_STYLE, InpMidStyle);
   ObjectSetInteger(0, mid, OBJPROP_WIDTH, InpMidWidth);
   ObjectSetInteger(0, mid, OBJPROP_RAY_RIGHT, ObjectGetInteger(0, ch, OBJPROP_RAY_RIGHT));
   ObjectSetInteger(0, mid, OBJPROP_RAY_LEFT, ObjectGetInteger(0, ch, OBJPROP_RAY_LEFT));
   ObjectSetInteger(0, mid, OBJPROP_TIMEFRAMES, ObjectGetInteger(0, ch, OBJPROP_TIMEFRAMES));
   ObjectSetString(0, mid, OBJPROP_TOOLTIP, "50% of " + ch);
   if(InpMidLabel)
     {
      datetime tl = t0 > t1 ? t0 : t1; double pl = t0 > t1 ? m0 : m1;
      if(ObjectFind(0, lab) < 0) ObjectCreate(0, lab, OBJ_TEXT, 0, tl, pl); else ObjectMove(0, lab, 0, tl, pl);
      ObjectSetString(0, lab, OBJPROP_TEXT, " 50%");
      ObjectSetInteger(0, lab, OBJPROP_COLOR, c);
      ObjectSetInteger(0, lab, OBJPROP_FONTSIZE, 7);
      ObjectSetInteger(0, lab, OBJPROP_ANCHOR, ANCHOR_LEFT);
      ObjectSetInteger(0, lab, OBJPROP_SELECTABLE, false);
      ObjectSetInteger(0, lab, OBJPROP_HIDDEN, true);
     }
   else ObjectDelete(0, lab);
  }

// every channel on the chart; 50% lines whose channel is gone are removed
void MidAll()
  {
   for(int i = ObjectsTotal(0, -1, -1) - 1; i >= 0; i--)
     {
      string nm = ObjectName(0, i, -1, -1);
      if(IsMid(nm))
        {
         string ch = StringSubstr(nm, 0, StringFind(nm, MID_SFX));
         if(ObjectFind(0, ch) < 0) ObjectDelete(0, nm);
        }
      else if((ENUM_OBJECT)ObjectGetInteger(0, nm, OBJPROP_TYPE) == OBJ_CHANNEL) MidUpdate(nm);
     }
  }

int OnInit()
  {
   ChartSetInteger(0, CHART_EVENT_OBJECT_CREATE, true);
   ChartSetInteger(0, CHART_EVENT_OBJECT_DELETE, true);
   MidAll();
   EventSetTimer(1);                       // catches property-dialog edits and template loads
   ChartRedraw();
   return(INIT_SUCCEEDED);
  }

void OnDeinit(const int r)
  {
   EventKillTimer();
   for(int i = ObjectsTotal(0, -1, -1) - 1; i >= 0; i--)
     {
      string nm = ObjectName(0, i, -1, -1);
      if(IsMid(nm)) ObjectDelete(0, nm);
     }
   ChartRedraw();
  }

void OnTimer() { MidAll(); ChartRedraw(); }

void OnChartEvent(const int id, const long &lparam, const double &dparam, const string &sparam)
  {
   if(IsMid(sparam)) return;
   if(id == CHARTEVENT_OBJECT_CREATE || id == CHARTEVENT_OBJECT_DRAG || id == CHARTEVENT_OBJECT_CHANGE || id == CHARTEVENT_OBJECT_DELETE)
     { MidUpdate(sparam); ChartRedraw(); }
  }

int OnCalculate(const int rates_total, const int prev_calculated, const datetime &time[], const double &open[],
                const double &high[], const double &low[], const double &close[], const long &tick_volume[],
                const long &volume[], const int &spread[])
  {
   return(rates_total);
  }
