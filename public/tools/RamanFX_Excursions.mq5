//+------------------------------------------------------------------+
//| RamanFX_Excursions.mq5                                           |
//| Exports exact MAE / MFE, the INITIAL stop & target, and where    |
//| price went after each exit, for every closed position.           |
//| Uses tick history when the broker has it (exact), M1 bars        |
//| otherwise. Output: MQL5\Files\RamanFX_Excursions.csv             |
//| Import that file in RamanFX (Import → drop the CSV).             |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "1.00"
#property script_show_inputs
#property strict

input int  InpDaysBack = 1095;   // How many days of history to export
input bool InpUseTicks = true;   // Use tick data when available (most exact)

struct Pos
  {
   ulong    id;
   string   sym;
   int      dir;        // +1 buy, -1 sell, 0 unknown
   datetime tIn;
   long     mscIn;
   double   pIn;
   double   volIn;
   datetime tOut;
   long     mscOut;
   double   pOutSum;
   double   volOut;
   double   profit;
   double   sl0;
   double   tp0;
  };

Pos ps[];
int cnt = 0;

int FindOrAdd(const ulong id, const string sym)
  {
   for(int j = cnt - 1; j >= 0; j--)
      if(ps[j].id == id)
         return j;
   ArrayResize(ps, cnt + 1, 1000);
   ZeroMemory(ps[cnt]);
   ps[cnt].id = id;
   ps[cnt].sym = sym;
   cnt++;
   return cnt - 1;
  }

// Price in the trade's favour (+) or against (−), in points, measured from entry.
double Pts(const Pos &p, const double price, const double point) { return (price - p.pIn) * p.dir / point; }

// Price at time t from M1 bars (close of the bar that contains t).
bool PriceAt(const string sym, const datetime t, double &px)
  {
   if(t > TimeCurrent())
      return false;
   int sh = iBarShift(sym, PERIOD_M1, t, false);
   if(sh < 0)
      return false;
   px = iClose(sym, PERIOD_M1, sh);
   return px > 0;
  }

void OnStart()
  {
   datetime to = TimeCurrent() + 86400, from = TimeCurrent() - (datetime)InpDaysBack * 86400;
   if(!HistorySelect(from, to))
     {
      Alert("RamanFX: could not read account history");
      return;
     }
   int n = HistoryDealsTotal();
   for(int i = 0; i < n; i++)
     {
      ulong d = HistoryDealGetTicket(i);
      if(d == 0)
         continue;
      long type = HistoryDealGetInteger(d, DEAL_TYPE);
      if(type != DEAL_TYPE_BUY && type != DEAL_TYPE_SELL)
         continue;
      long entry = HistoryDealGetInteger(d, DEAL_ENTRY);
      ulong pid = (ulong)HistoryDealGetInteger(d, DEAL_POSITION_ID);
      int k = FindOrAdd(pid, HistoryDealGetString(d, DEAL_SYMBOL));
      double vol = HistoryDealGetDouble(d, DEAL_VOLUME), price = HistoryDealGetDouble(d, DEAL_PRICE);
      long msc = HistoryDealGetInteger(d, DEAL_TIME_MSC);
      ps[k].profit += HistoryDealGetDouble(d, DEAL_PROFIT) + HistoryDealGetDouble(d, DEAL_SWAP) + HistoryDealGetDouble(d, DEAL_COMMISSION);
      if(entry == DEAL_ENTRY_IN)
        {
         if(ps[k].dir == 0)
           {
            ps[k].dir = (type == DEAL_TYPE_BUY) ? 1 : -1;
            ps[k].tIn = (datetime)HistoryDealGetInteger(d, DEAL_TIME);
            ps[k].mscIn = msc;
            ps[k].pIn = price;
            ps[k].volIn = vol;
            // Initial stop/target: from the opening order, falling back to the deal itself.
            ulong ord = (ulong)HistoryDealGetInteger(d, DEAL_ORDER);
            if(ord > 0 && HistoryOrderSelect(ord))
              {
               ps[k].sl0 = HistoryOrderGetDouble(ord, ORDER_SL);
               ps[k].tp0 = HistoryOrderGetDouble(ord, ORDER_TP);
              }
            if(ps[k].sl0 == 0)
               ps[k].sl0 = HistoryDealGetDouble(d, DEAL_SL);
            if(ps[k].tp0 == 0)
               ps[k].tp0 = HistoryDealGetDouble(d, DEAL_TP);
           }
         else
           {
            ps[k].pIn = (ps[k].pIn * ps[k].volIn + price * vol) / (ps[k].volIn + vol);
            ps[k].volIn += vol;
           }
        }
      else
         if(entry == DEAL_ENTRY_OUT || entry == DEAL_ENTRY_OUT_BY || entry == DEAL_ENTRY_INOUT)
           {
            ps[k].pOutSum += price * vol;
            ps[k].volOut += vol;
            if(msc > ps[k].mscOut)
              {
               ps[k].mscOut = msc;
               ps[k].tOut = (datetime)HistoryDealGetInteger(d, DEAL_TIME);
              }
           }
     }

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
   int done = 0, viaTicks = 0;
   for(int k = 0; k < cnt; k++)
     {
      Pos p = ps[k];
      if(p.dir == 0 || p.volOut < p.volIn - 1e-8 || p.mscOut <= p.mscIn)
         continue; // still open, or incomplete history
      double point = SymbolInfoDouble(p.sym, SYMBOL_POINT);
      if(point <= 0)
         continue;
      double pOut = p.pOutSum / p.volOut;
      double best = p.pIn, worst = p.pIn;
      long tBest = p.mscIn, tWorst = p.mscIn;
      string src = "M1";
      bool ok = false;
      if(InpUseTicks)
        {
         MqlTick ticks[];
         int got = CopyTicksRange(p.sym, ticks, COPY_TICKS_INFO, (ulong)p.mscIn, (ulong)p.mscOut);
         if(got > 0)
           {
            // A long is closed at the bid, a short at the ask.
            for(int i = 0; i < got; i++)
              {
               double px = (p.dir > 0) ? ticks[i].bid : ticks[i].ask;
               if(px <= 0)
                  continue;
               if((px - best) * p.dir > 0)
                 { best = px; tBest = ticks[i].time_msc; }
               if((px - worst) * p.dir < 0)
                 { worst = px; tWorst = ticks[i].time_msc; }
              }
            ok = true;
            src = "ticks";
            viaTicks++;
           }
        }
      if(!ok)
        {
         MqlRates r[];
         int got = CopyRates(p.sym, PERIOD_M1, p.tIn, p.tOut, r);
         for(int i = 0; i < got; i++)
           {
            double spr = (p.dir < 0) ? r[i].spread * point : 0; // shorts close at the ask
            double hi = r[i].high + spr, lo = r[i].low + spr;
            double fav = (p.dir > 0) ? hi : lo, adv = (p.dir > 0) ? lo : hi;
            if((fav - best) * p.dir > 0)
              { best = fav; tBest = (long)r[i].time * 1000; }
            if((adv - worst) * p.dir < 0)
              { worst = adv; tWorst = (long)r[i].time * 1000; }
           }
         if(got <= 0)
            src = "none";
        }
      // The fills themselves are real prices, so the excursion is at least as wide as entry→exit.
      if((pOut - best) * p.dir > 0)
         best = pOut;
      if((pOut - worst) * p.dir < 0)
         worst = pOut;
      double profitPts = Pts(p, pOut, point), mfe = Pts(p, best, point), mae = Pts(p, worst, point);

      string f[7];
      int secs[7] = {1800, 3600, 14400, 43200, 86400, 604800, 0};
      for(int j = 0; j < 6; j++)
        {
         double px;
         f[j] = PriceAt(p.sym, p.tOut + secs[j], px) ? DoubleToString(Pts(p, px, point), 1) : "N/A";
        }
      // Worst point within a week after the exit.
      f[6] = "N/A";
      if(p.tOut + 604800 <= TimeCurrent())
        {
         MqlRates w[];
         int got = CopyRates(p.sym, PERIOD_M5, p.tOut, p.tOut + 604800, w);
         if(got > 0)
           {
            double m = DBL_MAX;
            for(int i = 0; i < got; i++)
               m = MathMin(m, Pts(p, (p.dir > 0) ? w[i].low : w[i].high, point));
            f[6] = DoubleToString(m, 1);
           }
        }
      int digits = (int)SymbolInfoInteger(p.sym, SYMBOL_DIGITS);
      FileWrite(h, IntegerToString((long)p.id), p.sym, (p.dir > 0) ? "buy" : "sell",
                TimeToString(p.tIn, TIME_DATE | TIME_SECONDS), TimeToString(p.tOut, TIME_DATE | TIME_SECONDS),
                DoubleToString((p.mscOut - p.mscIn) / 3600000.0, 2), DoubleToString(p.profit, 2), DoubleToString(profitPts, 1),
                DoubleToString(mae, 1), DoubleToString(mfe, 1), f[0], f[1], f[2], f[3], f[4], f[5], f[6],
                (p.sl0 > 0) ? DoubleToString(p.sl0, digits) : "", (p.tp0 > 0) ? DoubleToString(p.tp0, digits) : "",
                DoubleToString(p.pIn, digits), DoubleToString(pOut, digits), DoubleToString(p.volIn, 2),
                DoubleToString((tBest - p.mscIn) / 60000.0, 1), DoubleToString((tWorst - p.mscIn) / 60000.0, 1), src);
      done++;
     }
   FileClose(h);
   string path = TerminalInfoString(TERMINAL_DATA_PATH) + "\\MQL5\\Files\\" + name;
   Alert("RamanFX: ", done, " positions exported (", viaTicks, " from ticks). File: ", path);
   Print("RamanFX export: ", path);
  }
//+------------------------------------------------------------------+
