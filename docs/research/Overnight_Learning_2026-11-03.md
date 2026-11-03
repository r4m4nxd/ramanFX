# Overnight learning: what the tests found (Nov 3, 2026)

Everything below ran on real history in GitHub Actions overnight: OANDA prices 2005/2010–2026 for 115 FX, metal, index and
commodity markets, and Alpaca daily prices 2016–2026 for 736 stocks. Every result is after trading costs, and every idea
had to work on **recent years it was not tuned on** (2020–2026 for FX, 2022+ for stocks). Full tables are on the `data`
branch: `docs/research/arrival_study/round3/Round3.md`, `round4/Round4.md`, `docs/research/Stock_Backtest.md`.

## The short answer

1. **Mechanical supply-and-demand trading on FX, metals and indices has no edge after costs.** 35,000 zone trades and
   3,700 arrival trades lost about 0.05 to 0.15R per trade in both 2010–2019 and 2020–2026. None of the 62 new ideas
   (trend filters, continuation vs reversal zones, volatility, session, wider stops, time stops, break-even, trailing,
   second-touch depth) made it profitable. This matches round 2, which found the same for Kevin's own calls.
2. **Some ideas consistently lose LESS** (worth keeping as rules, but they do not make it profitable):
   - continuation zones (rally-base-rally / drop-base-drop) beat reversal zones: -0.05R vs -0.15R per trade;
   - wider stops beat tight ones: stop 1 ATR beyond the zone -0.06R vs 0.1 ATR -0.14R;
   - for arrivals, trading with the 12-month trend: best variant +0.07R in recent years (not proven, could be luck).
3. **What did make money on the same markets:** simply holding stock indices and metals (sized for risk) returned about
   +12% a year in 2020–2026 (Sharpe 1.1). A 12-month trend filter on them was the only strategy that passed every check
   (Sharpe 0.96), but it did not beat just holding. Long/short trend following on everything was positive recently
   (+6.9% a year) but flat in 2010–2019. Breakouts and short-term dip-buying were about break-even.
4. **Stocks, swing trades:** the live stock rules are so strict they produced 8 signals in 9 years on 736 stocks.
   With the main gates loosened there were 134 trades: profitable in older years (+0.72R) but losing recently (-0.50R).
   Too few trades to trust any rule change; the learner correctly changed nothing.
5. **Stocks, long-term (TFSA):** 38,000 buys at weekly / monthly / 3-month buy areas, held 12 months, no stop:
   - On average they beat buying the same stock on a random day by +2.8% and SPY by +4.6%, but the median buy lagged SPY,
     and once you account for good and bad market periods clustering together, **nothing is statistically proven**.
   - The most consistent rule: **do not buy in the top third of the 2-year price range.** Buys low in the range beat a
     random day in both periods (+12% older, +3% recent); buys in the top third lost to a random day in both (-7.5%, -4.2%).
   - Monthly and 3-month buy areas were stronger than weekly ones (+7 to +10% vs +2%), mostly in older years.
   - A stop (monthly close below the zone) roughly halved the 12-month return: no stops on long-term holds.
   - Caveat: the stock list is today's companies, so stocks that went bust are missing; that flatters every result.

## FX scanner rule experiments (finished 07:32 UTC)

- The scanner's **current FX rules made 0 trades in 21 years** (2005–2026, 115 markets): the gates never all line up.
- With the nesting rule off: 52 trades. With nesting + spread off ("loose"): 88 trades, **-0.51R per trade in 2005–2020
  and -0.06R in 2020–2026**, win rate 12–24%. Half the trades never got more than +0.6R in their favour.
- None of the 19 rule changes (break-even, targets, freshness, continuation, stops, approach, curve, cancel, size) has
  enough trades to judge; the learner changed nothing. Small hints only: break-even at 1R and dropping continuation
  zones looked better recently (n = 21 and 14, not meaningful).

## What I recommend

- **Treat the zone alerts as a watchlist, not trade signals.** The data says the edge, if any, is in your own judgment,
  not in the mechanical rules. Trade small, journal every trade, and let the live tracker (now recording every alert)
  show whether your picks beat the alerts.
- **Keep these rules** (they lose less): prefer continuation zones with the 12-month trend; give stops room (about
  1 ATR beyond the zone); skip buys in the top third of the bigger range.
- **TFSA:** buy at monthly / 3-month buy areas when the stock is low in its 2-year range; no stop-loss; size each stock
  small. Expect to lag the index about half the time.
- **Core money:** the strongest result of the night is the boring one: a diversified index fund held long-term.

## What now runs by itself

- Every scan records each published idea and follows it on later candles (fill, stop, target, best / worst move).
- Monthly: the FX and stock backtests test 19 / 17 rule changes on three rule sets; the learner (5th of each month)
  adopts a change only if it wins in both older and recent data with enough trades, at most 3 per month, and drops it
  when it stops working. It messages you when anything changes. `/learn` in the bot shows the current state.
