//+------------------------------------------------------------------+
//| RamanFX_Excursions.mq4                                           |
//| MT4 version: MAE / MFE and where price went after each exit,     |
//| from the smallest timeframe whose history covers the trade.      |
//| MT4 does not keep the stop a trade was opened with, so set the   |
//| initial risk on the trade in RamanFX if you moved your stop.     |
//| Output: MQL4\Files\RamanFX_Excursions.csv                        |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "1.00"
#property show_inputs
#property strict

input int InpDaysBack = 1095; // How many days of history to export

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
             "Initial SL", "Initial TP", "Entry", "Exit", "Volume", "Minutes to MFE", "Minutes to MAE", "Source");
   datetime from = TimeCurrent() - (datetime)InpDaysBack * 86400;
   int done = 0;
   for(int i = OrdersHistoryTotal() - 1; i >= 0; i--)
     {
      if(!OrderSelect(i, SELECT_BY_POS, MODE_HISTORY) || OrderType() > OP_SELL || OrderCloseTime() < from)
         continue;
      string sym = OrderSymbol();
      double point = MarketInfo(sym, MODE_POINT);
      if(point <= 0)
         continue;
      int dir = (OrderType() == OP_BUY) ? 1 : -1;
      double pin = OrderOpenPrice(), pout = OrderClosePrice();
      datetime tin = OrderOpenTime(), tout = OrderCloseTime();
      int tf = BestTf(sym, tin);
      int a = iBarShift(sym, tf, tin, false), b = iBarShift(sym, tf, tout, false);
      double best = pin, worst = pin;
      datetime tb = tin, tw = tin;
      for(int s = a; s >= b && s >= 0; s--)
        {
         double fav = (dir > 0) ? iHigh(sym, tf, s) : iLow(sym, tf, s), adv = (dir > 0) ? iLow(sym, tf, s) : iHigh(sym, tf, s);
         if((fav - best) * dir > 0) { best = fav; tb = iTime(sym, tf, s); }
         if((adv - worst) * dir < 0) { worst = adv; tw = iTime(sym, tf, s); }
        }
      if((pout - best) * dir > 0) best = pout;
      if((pout - worst) * dir < 0) worst = pout;
      int dg = (int)MarketInfo(sym, MODE_DIGITS);
      string src = (tf == PERIOD_M1) ? "M1" : (tf == PERIOD_M5) ? "M5" : (tf == PERIOD_M15) ? "M15" : (tf == PERIOD_H1) ? "H1" : "H4+";
      FileWrite(h, IntegerToString(OrderTicket()), sym, (dir > 0) ? "buy" : "sell", TimeToString(tin, TIME_DATE | TIME_SECONDS), TimeToString(tout, TIME_DATE | TIME_SECONDS),
                DoubleToString((tout - tin) / 3600.0, 2), DoubleToString(OrderProfit() + OrderSwap() + OrderCommission(), 2),
                DoubleToString((pout - pin) * dir / point, 1), DoubleToString((worst - pin) * dir / point, 1), DoubleToString((best - pin) * dir / point, 1),
                At(sym, tout + 1800, pin, dir, point), At(sym, tout + 3600, pin, dir, point), At(sym, tout + 14400, pin, dir, point),
                At(sym, tout + 43200, pin, dir, point), At(sym, tout + 86400, pin, dir, point), At(sym, tout + 604800, pin, dir, point), "N/A",
                "", "", DoubleToString(pin, dg), DoubleToString(pout, dg), DoubleToString(OrderLots(), 2),
                DoubleToString((tb - tin) / 60.0, 1), DoubleToString((tw - tin) / 60.0, 1), src);
      done++;
     }
   FileClose(h);
   Alert("RamanFX: ", done, " trades exported to ", TerminalInfoString(TERMINAL_DATA_PATH), "\\MQL4\\Files\\", name);
  }
//+------------------------------------------------------------------+
