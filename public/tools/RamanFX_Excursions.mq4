//+------------------------------------------------------------------+
//| RamanFX_Excursions.mq4  (v2)                                     |
//| MT4 version: MAE / MFE, how each trade closed (SL / TP / manual),|
//| when price first touched each R level (so management rules      |
//| replay exactly) and what price did after you exited - from the   |
//| smallest timeframe whose history covers the trade.               |
//| MT4 does not keep the stop a trade was opened with, the entry    |
//| order type or slippage: R uses the final stop, and only when it  |
//| is still on the losing side. Set Account History to All History. |
//| Output: MQL4\Files\RamanFX_Excursions.csv                        |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "2.00"
#property show_inputs
#property strict

input int InpDaysBack = 1095; // How many days of history to export
input int InpAfterDays = 7;   // Follow price this many days after the exit

// First-touch times (minutes from entry) of R levels along the price path; -1 = not touched.
struct Track
  {
   double   pIn;
   double   R;
   int      dir;
   datetime t0;
   double   t05, t1, t2, t3, tm05, tsl, be05, be1, h05;
  };

// Smallest timeframe that has bars back to time t (M1 history in MT4 is often short).
int BestTf(const string sym, const datetime t)
  {
   int tfs[5] = {PERIOD_M1, PERIOD_M5, PERIOD_M15, PERIOD_H1, PERIOD_H4};
   for(int i = 0; i < 5; i++)
     {
      int bars = iBars(sym, tfs[i]);
      if(bars > 0 && iTime(sym, tfs[i], bars - 1) <= t)
         return tfs[i];
     }
   return PERIOD_D1;
  }

string At(const string sym, const datetime t, const double entry, const int dir, const double point)
  {
   if(t > TimeCurrent())
      return "N/A";
   int tf = BestTf(sym, t);
   int sh = iBarShift(sym, tf, t, false);
   if(sh < 0)
      return "N/A";
   return DoubleToString((iClose(sym, tf, sh) - entry) * dir / point, 1);
  }

void TrInit(Track &k, const double pIn, const int dir, const double R, const datetime t0)
  {
   k.pIn = pIn;
   k.dir = dir;
   k.R = R;
   k.t0 = t0;
   k.t05 = -1; k.t1 = -1; k.t2 = -1; k.t3 = -1; k.tm05 = -1; k.tsl = -1; k.be05 = -1; k.be1 = -1; k.h05 = -1;
  }

// One bar: the adverse side is checked first, so a bar that holds both counts the stop first (conservative).
void TrStep(Track &k, const datetime t, const double fav, const double adv)
  {
   if(k.R <= 0 || k.tsl >= 0)
      return;
   double m = (t - k.t0) / 60.0;
   if(m < 0)
      m = 0;
   double a = (adv - k.pIn) * k.dir / k.R, f = (fav - k.pIn) * k.dir / k.R;
   if(k.tm05 < 0 && a <= -0.5) k.tm05 = m;
   if(k.t05 >= 0 && k.be05 < 0 && a <= 0) k.be05 = m;
   if(k.t1 >= 0 && k.be1 < 0 && a <= 0) k.be1 = m;
   if(k.t1 >= 0 && k.h05 < 0 && a <= -0.5) k.h05 = m;
   if(a <= -1.0)
     {
      k.tsl = m;
      return;
     }
   if(k.t05 < 0 && f >= 0.5) k.t05 = m;
   if(k.t1 < 0 && f >= 1.0) k.t1 = m;
   if(k.t2 < 0 && f >= 2.0) k.t2 = m;
   if(k.t3 < 0 && f >= 3.0) k.t3 = m;
  }

string Mins(const double v) { return v < 0 ? "" : DoubleToString(v, 1); }

string ReasonOf(const string c)
  {
   if(StringFind(c, "[sl]") >= 0) return "sl";
   if(StringFind(c, "[tp]") >= 0) return "tp";
   if(StringFind(c, "so:") >= 0) return "so";
   return "manual";
  }

void OnStart()
  {
   string name = "RamanFX_Excursions.csv";
   int h = FileOpen(name, FILE_WRITE | FILE_CSV | FILE_ANSI, ',');
   if(h == INVALID_HANDLE)
     {
      Alert("RamanFX: cannot write ", name);
      return;
     }
   FileWrite(h, "Position ID", "Symbol", "Type", "Open Time", "Close Time", "Duration (Hrs)", "Profit ($)", "Profit (Pts)", "MAE (Pts)", "MFE (Pts)",
             "T+30m (Pts)", "T+1h (Pts)", "T+4h (Pts)", "T+12h (Pts)", "T+1d (Pts)", "T+1w (Pts)", "T+1w MIN (Pts)",
             "Initial SL", "Initial TP", "Entry", "Exit", "Volume", "Minutes to MFE", "Minutes to MAE", "Source",
             "Exit Reason", "Closes", "Exits", "Entry Order", "Requested", "Slippage (Pts)", "Order Placed",
             "MAE before MFE (Pts)", "Hit +0.5R", "Hit +1R", "Hit +2R", "Hit +3R", "Hit -0.5R", "Hit SL", "BE after +0.5R", "BE after +1R", "-0.5R after +1R",
             "After Exit", "After Exit Min", "Max After 1d (Pts)", "Max After 1w (Pts)");
   datetime now = TimeCurrent(), from = now - (datetime)InpDaysBack * 86400;
   int done = 0;
   for(int i = OrdersHistoryTotal() - 1; i >= 0; i--)
     {
      if(!OrderSelect(i, SELECT_BY_POS, MODE_HISTORY) || OrderType() > OP_SELL || OrderCloseTime() < from)
         continue;
      string sym = OrderSymbol();
      double point = MarketInfo(sym, MODE_POINT);
      if(point <= 0)
         continue;
      Comment("RamanFX: ", done, " exported  ", sym);
      int dir = (OrderType() == OP_BUY) ? 1 : -1;
      double pin = OrderOpenPrice(), pout = OrderClosePrice(), sl = OrderStopLoss(), tp = OrderTakeProfit();
      datetime tin = OrderOpenTime(), tout = OrderCloseTime();
      // 1R from the final stop, only while it is still on the losing side of the entry.
      double R = (sl > 0 && (pin - sl) * dir > 0) ? MathAbs(pin - sl) : 0;
      Track tr;
      TrInit(tr, pin, dir, R, tin);
      int tf = BestTf(sym, tin);
      int a = iBarShift(sym, tf, tin, false), b = iBarShift(sym, tf, tout, false);
      double best = pin, worst = pin, worstAtBest = pin;
      datetime tb = tin, tw = tin;
      for(int s = a; s >= b && s >= 0; s--)
        {
         double fav = (dir > 0) ? iHigh(sym, tf, s) : iLow(sym, tf, s), adv = (dir > 0) ? iLow(sym, tf, s) : iHigh(sym, tf, s);
         if((adv - worst) * dir < 0) { worst = adv; tw = iTime(sym, tf, s); }
         if((fav - best) * dir > 0) { best = fav; tb = iTime(sym, tf, s); worstAtBest = worst; }
         TrStep(tr, iTime(sym, tf, s), fav, adv);
        }
      if((pout - best) * dir > 0) best = pout;
      if((pout - worst) * dir < 0) worst = pout;

      // After the exit: keep following the R levels, and see whether the stop or target came first.
      string after = "n/a", afterMin = "";
      double max1d = -DBL_MAX, max1w = -DBL_MAX;
      datetime endT = tout + (datetime)InpAfterDays * 86400;
      if(endT > now)
         endT = now;
      if(endT > tout)
        {
         int tf2 = BestTf(sym, tout);
         int sa = iBarShift(sym, tf2, tout, false), sb = iBarShift(sym, tf2, endT, false);
         if(sa >= 0)
            after = "none";
         for(int s = sa - 1; s >= sb && s >= 0; s--)
           {
            datetime t = iTime(sym, tf2, s);
            double fav = (dir > 0) ? iHigh(sym, tf2, s) : iLow(sym, tf2, s), adv = (dir > 0) ? iLow(sym, tf2, s) : iHigh(sym, tf2, s);
            TrStep(tr, t, fav, adv);
            double fp = (fav - pin) * dir / point;
            if(t <= tout + 86400 && fp > max1d) max1d = fp;
            if(t <= tout + 604800 && fp > max1w) max1w = fp;
            if(after == "none")
              {
               if(sl > 0 && (adv - sl) * dir <= 0)
                 { after = "sl"; afterMin = DoubleToString((t - tout) / 60.0, 1); }
               else if(tp > 0 && (fav - tp) * dir >= 0)
                 { after = "tp"; afterMin = DoubleToString((t - tout) / 60.0, 1); }
              }
           }
        }

      int dg = (int)MarketInfo(sym, MODE_DIGITS);
      string src = (tf == PERIOD_M1) ? "M1" : (tf == PERIOD_M5) ? "M5" : (tf == PERIOD_M15) ? "M15" : (tf == PERIOD_H1) ? "H1" : "H4+";
      FileWrite(h, IntegerToString(OrderTicket()), sym, (dir > 0) ? "buy" : "sell", TimeToString(tin, TIME_DATE | TIME_SECONDS), TimeToString(tout, TIME_DATE | TIME_SECONDS),
                DoubleToString((tout - tin) / 3600.0, 2), DoubleToString(OrderProfit() + OrderSwap() + OrderCommission(), 2),
                DoubleToString((pout - pin) * dir / point, 1), DoubleToString((worst - pin) * dir / point, 1), DoubleToString((best - pin) * dir / point, 1),
                At(sym, tout + 1800, pin, dir, point), At(sym, tout + 3600, pin, dir, point), At(sym, tout + 14400, pin, dir, point),
                At(sym, tout + 43200, pin, dir, point), At(sym, tout + 86400, pin, dir, point), At(sym, tout + 604800, pin, dir, point), "N/A",
                "", "", DoubleToString(pin, dg), DoubleToString(pout, dg), DoubleToString(OrderLots(), 2),
                DoubleToString((tb - tin) / 60.0, 1), DoubleToString((tw - tin) / 60.0, 1), src,
                ReasonOf(OrderComment()), "1", DoubleToString(pout, dg) + "@" + TimeToString(tout, TIME_DATE | TIME_SECONDS) + "x" + DoubleToString(OrderLots(), 2),
                "", "", "", "",
                DoubleToString((worstAtBest - pin) * dir / point, 1),
                Mins(tr.t05), Mins(tr.t1), Mins(tr.t2), Mins(tr.t3), Mins(tr.tm05), Mins(tr.tsl), Mins(tr.be05), Mins(tr.be1), Mins(tr.h05),
                after, afterMin, (max1d > -DBL_MAX) ? DoubleToString(max1d, 1) : "", (max1w > -DBL_MAX) ? DoubleToString(max1w, 1) : "");
      done++;
      if(done % 25 == 0)
         FileFlush(h);
     }
   Comment("");
   FileClose(h);
   if(done == 0)
      Alert("RamanFX: no closed trades found. In the Account History tab right-click -> All History, then run the script again.");
   else
      Alert("RamanFX: ", done, " trades exported to ", TerminalInfoString(TERMINAL_DATA_PATH), "\\MQL4\\Files\\", name);
  }
//+------------------------------------------------------------------+
