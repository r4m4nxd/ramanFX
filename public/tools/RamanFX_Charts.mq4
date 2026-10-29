//+------------------------------------------------------------------+
//| RamanFX_Charts.mq4                                               |
//| MT4 version: your broker's candles around every closed trade,   |
//| so RamanFX can replay each trade on a real chart.                |
//| M1, M5, M15, H1, H4, D1. MT4 keeps short M1/M5 history - open    |
//| those charts once (Home key scrolls back) for older trades.      |
//| Uses the trades in Account History - set it to All History.     |
//| Output: MQL4\Files\RamanFX_Bars.csv                              |
//| Import that file in RamanFX (Import → drop the CSV).             |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "1.10"
#property show_inputs
#property strict

input int InpDaysBack = 365; // Trades closed in the last N days

#define NTF 6
string          TfName[NTF] = {"M1", "M5", "M15", "H1", "H4", "D1"};
int             TfVal[NTF]  = {PERIOD_M1, PERIOD_M5, PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1};
// Context before entry / after exit, in seconds, and the longest hold each timeframe is used for.
long Before[NTF]  = {90 * 60, 8 * 3600, 36 * 3600, 5 * 86400, 20 * 86400, 200 * 86400};
long After[NTF]   = {60 * 60, 4 * 3600, 12 * 3600, 2 * 86400, 7 * 86400, 20 * 86400};
long MaxHold[NTF] = {4 * 3600, 2 * 86400, 10 * 86400, 60 * 86400, 400 * 86400, 100000 * 86400};

struct Win { string sym; int tf; datetime a; datetime b; bool used; };

Win ws[];
int wn = 0;

void AddWin(const string sym, const int tf, const datetime a, const datetime b)
  {
   ArrayResize(ws, wn + 1, 2000);
   ws[wn].sym = sym;
   ws[wn].tf = tf;
   ws[wn].a = a;
   ws[wn].b = b;
   ws[wn].used = false;
   wn++;
  }

// Ask MT4 for the history once and give it a moment to load. False if nothing is available.
bool Ready(const string sym, const int tf)
  {
   for(int k = 0; k < 20; k++)
     {
      ResetLastError();
      int n = iBars(sym, tf);
      if(n > 0 && GetLastError() != 4066)
         return true;
      Sleep(250);
     }
   return iBars(sym, tf) > 0;
  }

void OnStart()
  {
   datetime now = TimeCurrent(), from = now - (datetime)InpDaysBack * 86400;
   int trades = 0;
   for(int i = OrdersHistoryTotal() - 1; i >= 0; i--)
     {
      if(!OrderSelect(i, SELECT_BY_POS, MODE_HISTORY) || OrderType() > OP_SELL || OrderCloseTime() < from)
         continue;
      string sym = OrderSymbol();
      datetime tin = OrderOpenTime(), tout = OrderCloseTime();
      SymbolSelect(sym, true);
      long hold = (long)(tout - tin);
      for(int f = 0; f < NTF; f++)
         if(hold <= MaxHold[f])
           {
            datetime b = tout + (datetime)After[f];
            AddWin(sym, f, tin - (datetime)Before[f], b > now ? now : b);
           }
      trades++;
     }

   string name = "RamanFX_Bars.csv";
   int h = FileOpen(name, FILE_WRITE | FILE_CSV | FILE_ANSI, ',');
   if(h == INVALID_HANDLE)
     {
      Alert("RamanFX: cannot write ", name);
      return;
     }
   FileWrite(h, "RamanFX Bars", "1", IntegerToString(AccountNumber()));
   FileWrite(h, "Symbol", "TF", "Time", "Open", "High", "Low", "Close");

   long total = 0;
   int empty = 0;
   string missing = "";
   for(int i = 0; i < wn; i++)
     {
      if(ws[i].used)
         continue;
      // All windows for this symbol + timeframe, sorted by start, merged where they overlap.
      int idx[];
      int m = 0;
      for(int j = i; j < wn; j++)
         if(!ws[j].used && ws[j].sym == ws[i].sym && ws[j].tf == ws[i].tf)
           {
            ArrayResize(idx, m + 1, 500);
            idx[m++] = j;
            ws[j].used = true;
           }
      for(int x = 1; x < m; x++)
         for(int y = x; y > 0 && ws[idx[y]].a < ws[idx[y - 1]].a; y--)
           {
            int tmp = idx[y];
            idx[y] = idx[y - 1];
            idx[y - 1] = tmp;
           }
      string sym = ws[i].sym;
      int f = ws[i].tf;
      int tf = (int)TfVal[f];
      Comment("RamanFX: exporting ", sym, " ", TfName[f], " ...");
      if(!Ready(sym, tf))
        {
         empty++;
         missing = missing + " " + sym + " " + TfName[f];
         continue;
        }
      int dg = (int)MarketInfo(sym, MODE_DIGITS);
      datetime oldest = iTime(sym, tf, iBars(sym, tf) - 1);
      long before = total;
      datetime a = ws[idx[0]].a, b = ws[idx[0]].b;
      for(int x = 1; x <= m; x++)
        {
         if(x < m && ws[idx[x]].a <= b)
           {
            if(ws[idx[x]].b > b)
               b = ws[idx[x]].b;
            continue;
           }
         if(b >= oldest)
           {
            int sa = iBarShift(sym, tf, (a < oldest) ? oldest : a, false), sb = iBarShift(sym, tf, b, false);
            for(int q = sa; q >= sb && q >= 0; q--)
              {
               datetime t = iTime(sym, tf, q);
               if(t < a || t > b)
                  continue;
               FileWrite(h, sym, TfName[f], TimeToString(t, TIME_DATE | TIME_SECONDS),
                         DoubleToString(iOpen(sym, tf, q), dg), DoubleToString(iHigh(sym, tf, q), dg), DoubleToString(iLow(sym, tf, q), dg), DoubleToString(iClose(sym, tf, q), dg));
               total++;
              }
           }
         if(x < m)
           {
            a = ws[idx[x]].a;
            b = ws[idx[x]].b;
           }
        }
      if(total == before)
        {
         empty++;
         missing = missing + " " + sym + " " + TfName[f];
        }
      FileFlush(h);
     }
   Comment("");
   FileClose(h);
   string path = TerminalInfoString(TERMINAL_DATA_PATH) + "\\MQL4\\Files\\" + name;
   if(trades == 0)
      Alert("RamanFX: no closed trades found. In the Account History tab right-click -> All History, then run the script again.");
   else
      Alert("RamanFX: ", trades, " trades, ", total, " candles exported. File: ", path);
   if(empty > 0)
      Print("RamanFX: no history loaded for:", missing, " - open those charts, press Home to load older bars, and run again.");
   Print("RamanFX charts export: ", path);
  }
//+------------------------------------------------------------------+
