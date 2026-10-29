//+------------------------------------------------------------------+
//| RamanFX_Excursions.mq5  (v2)                                     |
//| For every closed position: exact MAE / MFE, the INITIAL stop &   |
//| target, how it closed (SL / TP / manual), the entry order type   |
//| and slippage, partial closes, when price first touched each R    |
//| level (so management rules replay exactly), and what price did   |
//| after you exited. Ticks when the broker keeps them, M1 otherwise.|
//| Output: MQL5\Files\RamanFX_Excursions.csv                        |
//| Import that file in RamanFX (Import -> drop the CSV).            |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "2.00"
#property script_show_inputs

input int  InpDaysBack = 1095;   // How many days of history to export
input bool InpUseTicks = true;   // Use tick data when available (most exact)
input int  InpAfterDays = 7;     // Follow price this many days after the exit

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
   string   reason;     // how the last exit happened
   int      outs;       // number of closing deals (partials)
   string   exits;      // price@time|price@time
   string   ordType;    // market / limit / stop / stop_limit
   double   reqPrice;   // price the entry order asked for
   datetime placed;     // when the entry order was placed
  };

// First-touch times (minutes from entry) of R levels along the price path; -1 = not touched.
struct Track
  {
   double pIn;
   double R;
   int    dir;
   long   msc0;
   double t05, t1, t2, t3, tm05, tsl, be05, be1, h05;
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
   ps[cnt].reason = "";
   ps[cnt].exits = "";
   ps[cnt].ordType = "";
   cnt++;
   return cnt - 1;
  }

// Price in the trade's favour (+) or against (-), in points, measured from entry.
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

void TrInit(Track &k, const double pIn, const int dir, const double R, const long msc0)
  {
   k.pIn = pIn;
   k.dir = dir;
   k.R = R;
   k.msc0 = msc0;
   k.t05 = -1; k.t1 = -1; k.t2 = -1; k.t3 = -1; k.tm05 = -1; k.tsl = -1; k.be05 = -1; k.be1 = -1; k.h05 = -1;
  }

// One price sample: fav = best price in it for the trade, adv = worst. The adverse side is
// checked first, so a bar that holds both counts the stop first (conservative).
void TrStep(Track &k, const long msc, const double fav, const double adv)
  {
   if(k.R <= 0 || k.tsl >= 0)
      return;
   double m = (msc - k.msc0) / 60000.0;
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

string ReasonOf(const long r)
  {
   if(r == DEAL_REASON_SL) return "sl";
   if(r == DEAL_REASON_TP) return "tp";
   if(r == DEAL_REASON_SO) return "so";
   if(r == DEAL_REASON_EXPERT) return "ea";
   if(r == DEAL_REASON_CLIENT || r == DEAL_REASON_MOBILE || r == DEAL_REASON_WEB) return "manual";
   return "other";
  }

string OrderKind(const long t)
  {
   if(t == ORDER_TYPE_BUY || t == ORDER_TYPE_SELL) return "market";
   if(t == ORDER_TYPE_BUY_LIMIT || t == ORDER_TYPE_SELL_LIMIT) return "limit";
   if(t == ORDER_TYPE_BUY_STOP || t == ORDER_TYPE_SELL_STOP) return "stop";
   if(t == ORDER_TYPE_BUY_STOP_LIMIT || t == ORDER_TYPE_SELL_STOP_LIMIT) return "stop_limit";
   return "";
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
            // Initial stop/target, order type, requested price and placing time: from the opening order.
            ulong ord = (ulong)HistoryDealGetInteger(d, DEAL_ORDER);
            if(ord > 0 && HistoryOrderSelect(ord))
              {
               ps[k].sl0 = HistoryOrderGetDouble(ord, ORDER_SL);
               ps[k].tp0 = HistoryOrderGetDouble(ord, ORDER_TP);
               ps[k].ordType = OrderKind(HistoryOrderGetInteger(ord, ORDER_TYPE));
               ps[k].reqPrice = HistoryOrderGetDouble(ord, ORDER_PRICE_OPEN);
               ps[k].placed = (datetime)HistoryOrderGetInteger(ord, ORDER_TIME_SETUP);
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
            ps[k].outs++;
            ps[k].reason = ReasonOf(HistoryDealGetInteger(d, DEAL_REASON));
            int dg = (int)SymbolInfoInteger(ps[k].sym, SYMBOL_DIGITS);
            string e = DoubleToString(price, dg) + "@" + TimeToString((datetime)HistoryDealGetInteger(d, DEAL_TIME), TIME_DATE | TIME_SECONDS) + "x" + DoubleToString(vol, 2);
            ps[k].exits = (ps[k].exits == "") ? e : ps[k].exits + "|" + e;
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
             "Initial SL", "Initial TP", "Entry", "Exit", "Volume", "Minutes to MFE", "Minutes to MAE", "Source",
             "Exit Reason", "Closes", "Exits", "Entry Order", "Requested", "Slippage (Pts)", "Order Placed",
             "MAE before MFE (Pts)", "Hit +0.5R", "Hit +1R", "Hit +2R", "Hit +3R", "Hit -0.5R", "Hit SL", "BE after +0.5R", "BE after +1R", "-0.5R after +1R",
             "After Exit", "After Exit Min", "Max After 1d (Pts)", "Max After 1w (Pts)");
   int done = 0, viaTicks = 0;
   datetime now = TimeCurrent();
   for(int k = 0; k < cnt; k++)
     {
      Pos p = ps[k];
      if(p.dir == 0 || p.volOut < p.volIn - 1e-8 || p.mscOut <= p.mscIn)
         continue; // still open, or incomplete history
      double point = SymbolInfoDouble(p.sym, SYMBOL_POINT);
      if(point <= 0)
         continue;
      Comment("RamanFX: ", done, " / ", cnt, "  ", p.sym);
      double pOut = p.pOutSum / p.volOut;
      double best = p.pIn, worst = p.pIn, worstAtBest = p.pIn;
      long tBest = p.mscIn, tWorst = p.mscIn;
      double R = (p.sl0 > 0) ? MathAbs(p.pIn - p.sl0) : 0;
      Track tr;
      TrInit(tr, p.pIn, p.dir, R, p.mscIn);
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
               if((px - worst) * p.dir < 0)
                 { worst = px; tWorst = ticks[i].time_msc; }
               if((px - best) * p.dir > 0)
                 { best = px; tBest = ticks[i].time_msc; worstAtBest = worst; }
               TrStep(tr, ticks[i].time_msc, px, px);
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
            if((adv - worst) * p.dir < 0)
              { worst = adv; tWorst = (long)r[i].time * 1000; }
            if((fav - best) * p.dir > 0)
              { best = fav; tBest = (long)r[i].time * 1000; worstAtBest = worst; }
            TrStep(tr, (long)r[i].time * 1000, fav, adv);
           }
         if(got <= 0)
            src = "none";
        }
      // The fills themselves are real prices, so the excursion is at least as wide as entry->exit.
      if((pOut - best) * p.dir > 0)
         best = pOut;
      if((pOut - worst) * p.dir < 0)
         worst = pOut;
      double profitPts = Pts(p, pOut, point), mfe = Pts(p, best, point), mae = Pts(p, worst, point);

      // After the exit: keep following the R levels, and see whether the original TP or SL came first.
      string after = "n/a", afterMin = "";
      double max1d = -DBL_MAX, max1w = -DBL_MAX;
      datetime endT = p.tOut + (datetime)InpAfterDays * 86400;
      if(endT > now)
         endT = now;
      if(endT > p.tOut)
        {
         MqlRates w[];
         int got = CopyRates(p.sym, PERIOD_M1, p.tOut, endT, w);
         if(got > 0)
            after = "none";
         for(int i = 0; i < got; i++)
           {
            double spr = (p.dir < 0) ? w[i].spread * point : 0;
            double hi = w[i].high + spr, lo = w[i].low + spr;
            double fav = (p.dir > 0) ? hi : lo, adv = (p.dir > 0) ? lo : hi;
            long ms = (long)w[i].time * 1000;
            if(ms > p.mscOut)
               TrStep(tr, ms, fav, adv);
            double fp = Pts(p, fav, point);
            if(w[i].time <= p.tOut + 86400 && fp > max1d) max1d = fp;
            if(w[i].time <= p.tOut + 604800 && fp > max1w) max1w = fp;
            if(after == "none")
              {
               if(p.sl0 > 0 && (adv - p.sl0) * p.dir <= 0)
                 { after = "sl"; afterMin = DoubleToString((w[i].time - p.tOut) / 60.0, 1); }
               else if(p.tp0 > 0 && (fav - p.tp0) * p.dir >= 0)
                 { after = "tp"; afterMin = DoubleToString((w[i].time - p.tOut) / 60.0, 1); }
              }
           }
        }

      string f[7];
      int secs[7] = {1800, 3600, 14400, 43200, 86400, 604800, 0};
      for(int j = 0; j < 6; j++)
        {
         double px;
         f[j] = PriceAt(p.sym, p.tOut + secs[j], px) ? DoubleToString(Pts(p, px, point), 1) : "N/A";
        }
      // Worst point within a week after the exit.
      f[6] = "N/A";
      if(p.tOut + 604800 <= now)
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
      string slip = "", req = "";
      if(p.reqPrice > 0)
        {
         req = DoubleToString(p.reqPrice, digits);
         slip = DoubleToString((p.pIn - p.reqPrice) * p.dir / point, 1); // + = filled worse than asked
        }
      FileWrite(h, IntegerToString((long)p.id), p.sym, (p.dir > 0) ? "buy" : "sell",
                TimeToString(p.tIn, TIME_DATE | TIME_SECONDS), TimeToString(p.tOut, TIME_DATE | TIME_SECONDS),
                DoubleToString((p.mscOut - p.mscIn) / 3600000.0, 2), DoubleToString(p.profit, 2), DoubleToString(profitPts, 1),
                DoubleToString(mae, 1), DoubleToString(mfe, 1), f[0], f[1], f[2], f[3], f[4], f[5], f[6],
                (p.sl0 > 0) ? DoubleToString(p.sl0, digits) : "", (p.tp0 > 0) ? DoubleToString(p.tp0, digits) : "",
                DoubleToString(p.pIn, digits), DoubleToString(pOut, digits), DoubleToString(p.volIn, 2),
                DoubleToString((tBest - p.mscIn) / 60000.0, 1), DoubleToString((tWorst - p.mscIn) / 60000.0, 1), src,
                p.reason, IntegerToString(p.outs), p.exits, p.ordType, req, slip,
                (p.placed > 0) ? TimeToString(p.placed, TIME_DATE | TIME_SECONDS) : "",
                DoubleToString(Pts(p, worstAtBest, point), 1),
                Mins(tr.t05), Mins(tr.t1), Mins(tr.t2), Mins(tr.t3), Mins(tr.tm05), Mins(tr.tsl), Mins(tr.be05), Mins(tr.be1), Mins(tr.h05),
                after, afterMin, (max1d > -DBL_MAX) ? DoubleToString(max1d, 1) : "", (max1w > -DBL_MAX) ? DoubleToString(max1w, 1) : "");
      done++;
      if(done % 25 == 0)
         FileFlush(h);
     }
   Comment("");
   FileClose(h);
   string path = TerminalInfoString(TERMINAL_DATA_PATH) + "\\MQL5\\Files\\" + name;
   Alert("RamanFX: ", done, " positions exported (", viaTicks, " from ticks). File: ", path);
   Print("RamanFX export: ", path);
  }
//+------------------------------------------------------------------+
