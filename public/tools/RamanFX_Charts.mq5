//+------------------------------------------------------------------+
//| RamanFX_Charts.mq5                                               |
//| Exports your broker's candles around every closed position so    |
//| RamanFX can replay each trade on a real chart.                   |
//| Timeframes: M1, M5, M15, H1, H4, D1 (windows overlap-merged).    |
//| Output: MQL5\Files\RamanFX_Bars.csv                              |
//| Import that file in RamanFX (Import → drop the CSV).             |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "1.10"
#property script_show_inputs
#property strict

input int InpDaysBack = 365; // Trades closed in the last N days

#define NTF 6
string          TfName[NTF] = {"M1", "M5", "M15", "H1", "H4", "D1"};
ENUM_TIMEFRAMES TfVal[NTF]  = {PERIOD_M1, PERIOD_M5, PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1};
// Context before entry / after exit, in seconds, and the longest hold each timeframe is used for.
long Before[NTF]  = {90 * 60, 8 * 3600, 36 * 3600, 5 * 86400, 20 * 86400, 200 * 86400};
long After[NTF]   = {60 * 60, 4 * 3600, 12 * 3600, 2 * 86400, 7 * 86400, 20 * 86400};
long MaxHold[NTF] = {4 * 3600, 2 * 86400, 10 * 86400, 60 * 86400, 400 * 86400, 100000 * 86400};

struct Pos { ulong id; string sym; datetime tIn; datetime tOut; };
struct Win { string sym; int tf; datetime a; datetime b; bool used; };

Pos ps[];
int cnt = 0;
Win ws[];
int wn = 0;

int FindOrAdd(const ulong id, const string sym)
  {
   for(int j = cnt - 1; j >= 0; j--)
      if(ps[j].id == id)
         return j;
   ArrayResize(ps, cnt + 1, 1000);
   ps[cnt].id = id;
   ps[cnt].sym = sym;
   ps[cnt].tIn = 0;
   ps[cnt].tOut = 0;
   cnt++;
   return cnt - 1;
  }

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

// Ask the terminal for the history once and wait (max ~5 s) for it to sync. False if nothing is available.
bool Ready(const string sym, const ENUM_TIMEFRAMES tf)
  {
   for(int k = 0; k < 20; k++)
     {
      if(Bars(sym, tf) > 0 && SeriesInfoInteger(sym, tf, SERIES_SYNCHRONIZED))
         return true;
      Sleep(250);
     }
   return Bars(sym, tf) > 0;
  }

void OnStart()
  {
   datetime now = TimeCurrent(), from = now - (datetime)InpDaysBack * 86400;
   if(!HistorySelect(from - 30 * 86400, now + 86400))
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
      int k = FindOrAdd((ulong)HistoryDealGetInteger(d, DEAL_POSITION_ID), HistoryDealGetString(d, DEAL_SYMBOL));
      datetime t = (datetime)HistoryDealGetInteger(d, DEAL_TIME);
      if(entry == DEAL_ENTRY_IN)
        {
         if(ps[k].tIn == 0 || t < ps[k].tIn)
            ps[k].tIn = t;
        }
      else
         if(entry == DEAL_ENTRY_OUT || entry == DEAL_ENTRY_OUT_BY || entry == DEAL_ENTRY_INOUT)
           {
            if(t > ps[k].tOut)
               ps[k].tOut = t;
           }
     }

   int trades = 0;
   for(int k = 0; k < cnt; k++)
     {
      if(ps[k].tIn == 0 || ps[k].tOut < ps[k].tIn || ps[k].tOut < from)
         continue; // open, incomplete, or too old
      SymbolSelect(ps[k].sym, true);
      long hold = (long)(ps[k].tOut - ps[k].tIn);
      for(int f = 0; f < NTF; f++)
         if(hold <= MaxHold[f])
           {
            datetime b = ps[k].tOut + (datetime)After[f];
            AddWin(ps[k].sym, f, ps[k].tIn - (datetime)Before[f], b > now ? now : b);
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
   FileWrite(h, "RamanFX Bars", "1", IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN)));
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
      Comment("RamanFX: exporting ", sym, " ", TfName[f], " ...");
      if(!Ready(sym, TfVal[f]))
        {
         empty++;
         missing = missing + " " + sym + " " + TfName[f];
         continue;
        }
      int dg = (int)SymbolInfoInteger(sym, SYMBOL_DIGITS);
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
         MqlRates r[];
         int got = CopyRates(sym, TfVal[f], a, b, r);
         for(int q = 0; q < got; q++)
            FileWrite(h, sym, TfName[f], TimeToString(r[q].time, TIME_DATE | TIME_SECONDS),
                      DoubleToString(r[q].open, dg), DoubleToString(r[q].high, dg), DoubleToString(r[q].low, dg), DoubleToString(r[q].close, dg));
         if(got > 0)
            total += got;
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
   string path = TerminalInfoString(TERMINAL_DATA_PATH) + "\\MQL5\\Files\\" + name;
   if(trades == 0)
      Alert("RamanFX: no closed trades found in the last ", InpDaysBack, " days of this account's history.");
   else
      Alert("RamanFX: ", trades, " trades, ", total, " candles exported. File: ", path);
   if(empty > 0)
      Print("RamanFX: no candles for:", missing, " - your broker may not keep that much history.");
   Print("RamanFX charts export: ", path);
  }
//+------------------------------------------------------------------+
