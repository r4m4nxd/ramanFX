# RamanFX Telegram Bot — Feature List

A personal market assistant for a supply/demand (top-down, multi-timeframe) trader. Forex, metals, indices,
commodities, crypto and ~1,000 US stocks. Runs on free tiers (GitHub Actions, Supabase, Vercel). Times in Calgary (MT).

## 1. Market coverage & data
| Market | Instruments | Data source | Freshness |
|---|---|---|---|
| Forex, metals, indices, energy | 116 | OANDA (bid prices) | Live on request; scanned hourly |
| Exotic FX crosses | 9 (e.g. GBPNOK, EURMXN, GBPTRY) | Built from OANDA pairs | Hourly |
| Currency indices | USDX, EURX, JPYX | Built from OANDA pairs (approximate) | Hourly, context only |
| Crypto | 15 (BTC, ETH, SOL, XRP…) | Coinbase / Kraken / Binance.US | Hourly, 24/7 incl. weekends |
| US stocks | ~996 | Alpaca (SIP daily, IEX real-time) | Live on request; scanned daily after the close |
| VIX, CA60, softs (coffee, cocoa…) | 9 | Yahoo (unofficial) — moving to Pepperstone cTrader | Pending |

## 2. Scanners & signals (automatic)
- **Supply & demand zone engine** across MN / W1 / D1 / H4 / H1 (FX) and 3M / MN / W1 / D1 (stocks), strict top-down nesting.
- **Signals**: BUY / SELL / WATCH with timeframe, entry, stop, target, % distance (no pips), "why" line, ⭐ when a mentor zone agrees.
- **Hourly FX scan** right after each 1H candle closes; 4-hour digest; daily summary.
- **Daily stock scan** ~30 min after the US close (2:30 PM Calgary).
- **News filter**: warns when high-impact news is near a signal.
- **Holdings exit alerts** for open positions.

## 3. Big moves (automatic)
- After every **1H, 4H, 1D and 1W** close: every symbol whose candle was ≥ 2× its 20-candle average range (+ a minimum %).
- **One message per hour**, grouped by timeframe (1W → 1D → 4H → 1H) and by market (Forex & metals / Indices & commodities / Crypto / Stocks).
- Each line: direction, % move, size vs normal, zone context ("into D1 supply", "broke MN demand"), 📰 headline explaining why.
- Daily/weekly moves held during quiet hours, delivered after — never dropped. Full list on the app's **Big moves** page.

## 4. On-demand (type a command or just a symbol)
| Command | What you get |
|---|---|
| *(send a symbol, e.g. `AAPL`)* | Live price, zones, chart button, latest headline |
| `/chart SYM [TF] [4]` | Chart image: 4 timeframes top-down, one timeframe, or **4 views from a chosen timeframe** (`/chart INTC MN 4`). Live candles, zones, trendlines (own TF solid, higher TF gold dotted). Timeframes 3M · MN · W1 · D1 · 4H · 1H · 15m |
| `/zones SYM` | Every zone of a symbol with % distance, recomputed on live candles |
| `/scan SYM` | Fresh full scan of one symbol in ~1 min (6/hour) |
| `/signals` · `/fx` · `/stocks` | Open setups (all / FX / today's stock BUY & WATCH) |
| `/near` | Everything within 1% of a zone |
| `/holders SYM` | Who owns a stock (SEC filings): 5%+ holders (13D/13G) with their last move, top insiders & 10% owners (Form 4), top 13F funds with the quarter-over-quarter change (index funds marked), and its last 30 days of insider buys/sales, Form 144 and 13D. 13F is up to 45 days old; the card says the quarter. Guests allowed |
| `/insiders [SYM]` | Insider cluster & early buys (⭐ first), big non-plan sales, planned sales (Form 144), activists (13D); with a symbol, that stock's 30 days |
| `/fund SYM` | Fundamentals — stocks: P/E, market cap, revenue/EPS growth, margin, debt, next earnings; FX: both central-bank rates, carry, inflation & growth, one-line bias |
| `/news [SYM]` | Today's economic calendar + top 5 market-moving headlines; per-symbol headlines |
| `/hours SYM` | Best times of day and days of week for that symbol (from years of history) |
| `/times` · `/next` | Today's key session times; next NFP, CPI and Fed decision |
| `/ask question` | Answers from the trading lessons library |
| `/guide` · `/help` | Cheat sheet + full in-app guide |

Inline buttons on every reply: 📊 Chart · timeframe switches · 🔲 4 views / 🔳 1 view · 🔎 Zones · 🔄 Live scan · 📰 News · 📑 Fundamentals · 👥 Holders · 🔕 Mute 1w · ⏰ alert. Persistent quick keyboard and a Mini App button opening the web app.

## 5. Alerts & personal controls
- `/alert` — price alerts or "alert me when price reaches a zone"; `/alerts`, `/unalert`.
- `/watch` / `/unwatch` — personal watchlist (feeds breaking news and the brief).
- `/mute` / `/unmute` (1 day / 1 week), `/quiet` hours, `/markets` (choose which markets message you).
- **Breaking news** on watched symbols / open trades (max 6/day, never in quiet hours).

## 6. Daily routine messages
- **6 AM brief**: biggest overnight candles with zone context, today's high-impact events, overnight headlines, earnings today/tomorrow, lesson of the day.
- **Event reminders**: NFP, CPI, FOMC (verified dates) ahead of time.
- **Sunday 6 PM weekly report** from the trade journal.

## 7. Trading coach (journal-linked)
- `/took` — log a trade as a plan; the coach asks "why did you take it?".
- **Rule guard**: warns when a trade breaks your own risk rules; **cooling-off** pause after losses.
- Weekly performance report.

## 8. Reliability & safety
- **Health watchdog**: silent unless something breaks (missed scan, failed job, rejected key, app not updating); one alert + one "resolved"; warns 14 and 3 days before the GitHub token expires. `/health` for status.
- Reliable scheduler (database timer) instead of GitHub's best-effort cron.
- Owner-only access; secrets stored only in GitHub/Supabase; no keys in chat.

## 9. Sharing (family / team)
- `/adduser ID Name` — up to 5 guests, `/users`, `/removeuser`.
- Guests get all market commands, their own alerts/mutes/quiet hours/markets, and the market messages (default stocks-only).
- Owner's journal, positions, alerts, watchlist, coach and health stay private (tested per command).

## 10. In progress
- **Chart quality pass**: dedupe trendlines, higher-TF lines everywhere, tighter wide zones, nesting warnings, verdict line, "closed" vs "live" labels, dated axes, labelled supply zones, spacing before the price scale.
- **Insider alerts** (SEC EDGAR, every 10 min on US weekdays 6:00–22:00 New York, several in one message, 6 a day, mutes / quiet hours / guests as usual): the **first big buy** (CEO/CFO/President/COO/Chair $100k+, anyone $500k+: "early · 1 insider so far"), then the **cluster** when others join (⭐ at a weekly/monthly demand zone); **big sales** (CEO/CFO/President/COO/Chair/10% owner, not a 10b5-1 plan, $1M+ or 0.1% of the market cap); **Form 144** planned sales; **Schedule 13D** activists. Every line shows the trade date and "filed 35m ago". `/insiders`.
- **Holders** (SEC 13D/13G, Form 4, 13F data sets; daily, 13F weekly): `/holders SYM`, the 👥 Holders button, and a Holders card on each stock page. Never an alert source; index funds are marked.
- **Pepperstone cTrader feed** for exact broker prices on every symbol (awaiting app approval).

## Cost
$0/month on free tiers (public repo). Limits: `/scan` 6/hour; Vercel 100 builds/day (data never triggers builds).

*Not financial advice — a decision-support tool.*
