# telegram-bot (Supabase edge function)

Two-way RamanFX Telegram bot. Telegram POSTs each update to this function; the reply goes back in the HTTP response
body, so the function never needs the bot token. Source: `index.ts` (HTTP, auth, database), `logic.ts` (commands,
pure), `prefs.ts` (alerts / mutes / quiet hours / watchlist), `chart.ts`, `ask.ts`, `news.ts`, `headlines.ts`. Deployed through
`tools/telegram_bot/deploy_entry.ts` (imports this folder at one pinned commit). Setup: `.github/workflows/telegram-webhook.yml`.

**`/guide`** (alias `/howto`): a compact cheat sheet (the main commands, what arrives by itself) with link buttons to the
app's full how-to page, https://raman-fx.vercel.app/guide (`#bot`, `#fix`). The page's content is
`src/content/guide.ts`; `src/content/guide.test.ts` fails when a command in `commands.json` has no row there, so add
one whenever a command is added.

**`/health`** (alias `/status`): the trader coach's last watchdog snapshot (`rfx_coach_config.dispatch.health`, written
every 30 min by `trader-coach/health.ts`): last good FX scan / stock scan / big moves / brief, keys OK (GitHub, OANDA,
Alpaca, Telegram), the GitHub token's expiry date and any open problem. Reads one row; no live calls.

## Owner preferences (Telegram commands)

| Command | Effect |
| --- | --- |
| `/alert SYM PRICE` | one-shot price alert; direction from the current price (`above` when PRICE > price, else `below`) |
| `/alert SYM zone` | one-shot: price enters any located strong zone of SYM (any timeframe) |
| `/alerts` | lists alerts (with 🗑 buttons), mutes, quiet hours, watchlist |
| `/unalert ID` | deletes an alert |
| `/mute SYM [1d\|1w]` / `/unmute SYM` | no scanner alerts for SYM until then (default 1d) |
| `/quiet 22:00-06:00` / `/quiet off` | quiet hours, Calgary clock (America/Edmonton) |
| `/watch SYM` / `/unwatch SYM` | extra watchlist symbols |
| `/scan SYM` / `[🔄 Live scan]` | on-demand scan of one symbol (callback `s:SYM`); `/scan` alone: every market |
| buttons on symbol cards | `[🔕 Mute 1w]` = callback `m:SYM:7` (days); `[⏰ 0.2%]` = callback `r:SYM:0.2` (pct alert) |

## Guests (sharing the bot) — `guests.ts`

Up to 5 people (family) get the market side of the bot; the owner's data stays private.

1. They send `/start` to the bot: an unknown chat gets only "Ask the owner to add you. Your ID: <id>" (at most once per
   10 min per chat, 30 an hour overall; every other message from an unknown chat is ignored, its id never stored).
2. The owner sends `/adduser <id> Name` (`… Name all` = every market), `/removeuser <id>`, `/users`. Stored in
   `public.rfx_bot_guests` (migration `20261029090000_rfx_bot_guests.sql`; service role only). The new guest gets a
   welcome + the quick keyboard (the one `sendMessage` this function makes itself, `TELEGRAM_BOT_TOKEN` secret).
3. A guest gets every market command and button (`/fx /stocks /signals /near /zones /chart /hours /fund /news /times
   /next /ask /guide /help`, `/scan`: 3 an hour each, inside the global 6) with `ctx.role = 'guest'` and their OWN prefs
   store (`rfx_bot_guests.prefs`: `/alert /alerts /unalert /mute /unmute /quiet /watch /unwatch`, and `/markets`:
   which markets' automatic messages they get, stocks only by default). Refused: `OWNER_ONLY` in `logic.ts`
   (`/took`, `/health`, the admin commands); journal replies (📝) are never routed for them. The Mini App menu button is
   set for the owner's chat only. `/ask` is the local BM25 search (no paid API), so guests have it.
4. Menus: the default command scope (everyone = guests) is `commands.json` without `commands_owner.json`
   `hide_from_guests`; the owner's chat scope adds `/adduser /removeuser /users` (`tools/telegram_bot/setup.py`).
5. Pushes: `?op=prefs` adds `guests: [{id (12 hex of sha256(chat id)), chat_id, name, markets, mutes, alerts, quiet,
   watch}]`; the jobs send each guest their share after the owner's message (`tools/stock_scanner/guests.py`): FX
   alerts / summary / digest, stock scan (no holdings exits, no watchlist lines), big moves, the morning brief without
   'Your symbols', held / watched earnings and (without forex) Kevin's plan, reminders, plus their own fired alerts.
   Never: coach, breaking news on the owner's positions, health alerts, the owner's alerts. `POST ?op=guest-inactive
   {guest}` (they blocked the bot: Telegram 403) and `POST ?op=guest-alert-fired {guest, id}`, same `X-RFX-Key`.
   On-demand `/scan` from a guest dispatches with the workflow input `to=<guest id>`: the card goes to them.
   Note: the FX alerts cover the owner's watchlist (incl. `/watch` extras), as for the owner.

## Scanner contract (prefs API)

The scanners (GitHub Actions) read the owner's preferences and report fired alerts.

**Key.** `key = hex(sha256(TELEGRAM_BOT_TOKEN + ":prefs"))` (64 lowercase hex chars), computed inside GitHub Actions
from the existing `TELEGRAM_BOT_TOKEN` secret. Never log it (`::add-mask::` it). The function stores only
`sha256(key)` (hex), registered by the setup workflow over its webhook-authenticated channel; it compares
`sha256(X-RFX-Key)` with that hash in constant time. No token or key is stored anywhere.

Python:

```python
key = hashlib.sha256((os.environ['TELEGRAM_BOT_TOKEN'] + ':prefs').encode()).hexdigest()
print(f'::add-mask::{key}')
```

**Read.** `GET https://dqjzufofmblerslcynzr.supabase.co/functions/v1/telegram-bot?op=prefs` with header `X-RFX-Key: <key>`

```json
{
  "mutes":  [{"sym": "EURUSD", "until_utc": "2026-11-05T04:00:00.000Z"}],
  "alerts": [
    {"id": 12, "sym": "XAUUSD", "kind": "price", "level": 2650.5, "dir": "above"},
    {"id": 13, "sym": "NVDA",   "kind": "zone"},
    {"id": 14, "sym": "GBPJPY", "kind": "pct", "pct": 0.2, "level": 191.42}
  ],
  "quiet":  {"from": "22:00", "to": "06:00", "tz": "America/Edmonton"},
  "watch":  ["AUDNZD", "AMD"],
  "open":   ["XAUUSD"]
}
```

- `mutes`: only mutes still in force (`until_utc` > now). A muted symbol gets no scanner alert card until then.
- `alerts`: only alerts not fired yet. All are one-shot.
  - `price`: fire when price crosses `level` in `dir` (`above`: price >= level; `below`: price <= level).
  - `zone`: fire when price is inside any strong zone of `sym` the scanner located (any timeframe).
  - `pct`: fire when price is within `pct` percent of the proximal line of the NEAREST strong zone of `sym` (any
    timeframe, the scanner's current zones). `level` = that proximal when the alert was set (a hint; may be absent).
- `quiet`: `null` when off. Times are HH:MM on the `tz` clock; `from` > `to` means the window wraps midnight. During
  quiet hours send alerts silently (`disable_notification: true`) or hold them; the scanners decide.
- `watch`: extra symbols the owner wants scanned / reported like watchlist (`wl`) symbols.
- Symbols are the bot's canonical names: FX = Pepperstone names (`EURUSD`, `XAUUSD`, `US500`), stocks = scanner
  tickers (`NVDA`, `BRK.B`).

**Fired.** `POST ...?op=alert-fired` with header `X-RFX-Key: <key>`, body `{"id": 12}` → `{"ok": true}` (the alert
stops being listed). Send it right after the alert message was delivered.

**Errors.** `401` wrong / missing key, `503` key not registered yet or database unavailable (treat both as "no
prefs": scan as usual, never fail the scan), `400` bad body. Time out after 10 s.

## Function secrets (the owner adds them in the Supabase dashboard; tooling never reads, copies or logs them)

Every secret is optional: without it the bot works exactly as before from the published scanner files, and says what
is missing in one line (e.g. `(live data needs OANDA/Alpaca keys in Supabase)`).

| Secret | Used by | Unlocks |
| --- | --- | --- |
| `OANDA_API_TOKEN` (practice account) | telegram-bot | **Live FX / metals / CFDs**: `/chart`, `/zones` and a bare symbol fetch the latest OANDA BID candles at request time (H1 / H4 / D1 / W1 / MN + M15 for the live-only **15m** chart view with its own 15m zones and 1H gold trendlines, the forming candle included, 30 s cache; Pepperstone names mapped to OANDA through the scan's `oanda` field). Price and zones are live (`live · 7:42 AM`); BUY / SELL / WATCH stay those of the latest scan. `OANDA_ENV=live` switches to the live host. |
| `ALPACA_KEY_ID` + `ALPACA_SECRET_KEY` | telegram-bot | **Live stocks**: daily bars since 2016 (split adjusted; SIP history, IEX when the plan refuses SIP), W1 / MN / 3M built from them, 1-hour and 15-minute bars (last 10 days) + the latest trade from the free real-time IEX feed. Adds the 1H and 15m stock chart views (W1 zones, trendlines). |
| `GITHUB_DISPATCH_TOKEN` (fine-grained, Actions: write on r4m4nxd/ramanFX) | telegram-bot, trader-coach | **`/scan`** (every market) and **`/scan SYM` / [🔄 Live scan]**: one symbol, `fx-scan.yml only=SYM` / `stock-scan.yml tickers=SYM` with `ondemand=true`; the scanner sends ONE result card (`🔄 SYM · on-demand scan`, every rule) in about a minute and writes nothing. 6 on-demand scans an hour. In trader-coach: the reliable 10-minute scheduler for the scans, the brief, the reminders and the hourly **big moves** (`movers.yml`, at :05). |
| `TELEGRAM_BOT_TOKEN` | telegram-bot, trader-coach | Bot: `answerCallbackQuery` (stops the button spinner at once, short toast); replies still go back in the webhook response without it. Coach: needed (with the chat id) to push its prompts. |
| `TELEGRAM_CHAT_ID` | trader-coach | Where the coach pushes (`📝 … why did you take it?`, the weekly card). |

The GitHub Actions jobs (scanners, brief, big moves) use their own repository secrets (`OANDA_API_TOKEN`,
`ALPACA_*`, `TELEGRAM_*`), not these.

### Live zones (`zonecore.ts`)

A TypeScript port of the scanners' zone DETECTION (zones.py `detect`, the `dna()` test count, `to_quarters`,
`forming_touched`; the zone filters of fxscan `detail()` and scan.py `ticker_detail()`): base + departure zones,
proximal / distal, demand / supply, the pattern, fresh / tested. The bot computes them on the live candles and draws
them with the usual nesting highlight. Not ported: zone DNA codes, location, direction, rules: signals come from the
latest scan run and are labelled so. Parity: `tools/telegram_bot/parity/make_fixtures.py` writes bars + the zones the
Python engines publish on them; `src/core/telegramZoneParity.test.ts` requires identical zones from the port.

### Chart trendlines (`trendcore.ts`)

A TypeScript port of the scanners' trendline construction (zones.py `trendlines`, `line_touches`, `cross_bar`:
swing-2 valleys / peaks, anchors refitted within 0.05 ATR, too-flat lines dropped, confirmed once price runs past the
swing between the anchors, removed when a bar lies fully beyond the line, crossed = a close through it with a body
>= 0.6 ATR). Each chart panel (each quarter of the 4-view image, and the single view) draws at most 2 lines of its own
timeframe (solid lilac) and at most 2 of the next higher timeframe projected onto its candles (gold dots;
15m -> H1 -> H4 -> D1 -> W1 -> MN -> 3M, stocks D1 -> W1 -> MN -> 3M). Picked: never removed, uncrossed first, the row's
in-force up / down line first, most touches, nearest price; only lines that enter the drawn candles' range. Computed on
the chart's candles (live: 250 closed bars, the scanners' 200-bar lookback); with the short published shards (80-120
bars) the scanner's own published lines (`tls`) are used instead. Parity: the same fixtures +
`src/core/telegramTrendParity.test.ts` (every line of every row identical).

Chart-only additions (not the scanners' rule, never published, no signal reads them; tests
`src/core/telegramChartNotes.test.ts`):
- **Fallback line** (`fallbackLine`, `fallback: true` on the drawn line): when a row has no uncrossed house line one way
  in view (e.g. BABA W1: the scanners' down line was removed by a spike, then price fell 190 -> 99, so the scanner
  publishes `tls.W1 = []`), the most significant unbroken line: from a swing high (low) of the last 200 bars, the
  tangent over every later high (low), house 'too flat' test, most touches then longest.
- **No duplicates** (`sameLine`): two lines of one direction never further apart than max(0.5 ATR, 1.5% of the drawn
  range) over their overlap are drawn once; the higher TF's line wins over an own-TF one.

### Chart notes (`chartnotes.ts`, display only)

- `zones[i].wide`: height > max(`WIDE_PCT[tf]` % of price, `WIDE_ATR[tf]` x the D1 ATR %) (W1 3% / 3x, MN 5% / 5x,
  3M 8% / 7x ...). The engine caps a zone at 1.5 ATR of its own TF when it forms, so a 3M zone can be 28% of price;
  `refine` = the nearest lower-TF same-side zone overlapping a wide one (where Kevin refines it).
- `panel.nestNote`: the panel's key zone (nearest price) against the next higher TF's same-side zones: `nested in 3M
  demand`, `overlaps ...`, `at ... (just outside)` (zones.py LOC_TOL 25%), `MN demand outside 3M demand (below)`,
  `no 3M supply to nest in`; null when the panel shows another TF's zones or the higher TF has none.
- `model.verdict` (<= 110 chars): price vs the nearest demand / supply of the signal's TF (else the lowest panel's zone
  TF), the highest-TF zone price is inside, the lowest panel's trend (own house lines, else swing structure, else
  fallback lines), `scanner: BUY W1 at 96.14` or `watch <zone>`, nesting, the other side; least important dropped first.
- Same-TF same-side zones covering >= 50% of the smaller are drawn as one (fresher, then score, then fewer touches).
- Higher-TF bars rebuilt from daily bars drop a partial first period; panels with < 12 candles say `short history`.

### Fundamentals (`fundamentals.ts`): `/fund SYM`, `/fundamentals SYM`, [📑 Fundamentals]

Reads two nightly files of `tools/fundamentals/build.py` (`.github/workflows/fundamentals.yml`, weekdays 18:00 New
York via the trader-coach scheduler + a backup cron), cached 30 min: `public/fundamentals/fx.json` and `stocks.json`.

- **FX pair** (`/fund EURUSD`): each currency's central bank rate, last decision (hiked / cut / held, last move), next
  meeting (Fed: federalreserve.gov dates), CPI y/y, GDP, unemployment (TradingView economic calendar actual values);
  the rate gap and which side earns the carry; a one-line **fundamental bias** ("USD stronger: higher rate, hotter
  CPI"), labelled context, not a signal. Metals / index CFDs / energy / crypto: a short note (US real rate, the
  index's central bank, USD) with the currency block it follows. `/fund` alone: the 8 major central banks.
- **Stock** (`/fund NVDA`): market cap, P/E, revenue + EPS TTM with YoY, net margin, debt / equity (SEC EDGAR
  companyfacts), last / next earnings (Nasdaq calendar, else estimated from the 8-K 2.02 / 10-Q cadence), latest 8-K
  titles, a [📄 SEC filings] link. Without an entry in `stocks.json`: the stock scanner's own fundamentals rows.
  TSX-only names: n/a. SEC is only contacted when the repository variable `SEC_CONTACT` is set.
- The [📑 Fundamentals] button (callback `f:SYM`) sits next to [🔄 Live scan] on zones and chart replies; stock zones
  replies add `📑 next earnings: Nov 4 (in 6 days)` when a report is within 14 days. The 6 AM brief lists held /
  watched / listed stocks reporting today or the next weekday.

### Big moves (hourly)

`tools/movers/movers.py` (`.github/workflows/movers.yml`): ONE message per hour when something moved >= 2x its
20-hour average range (FX: every scanner instrument, OANDA H1; stocks 7:00 AM-5:00 PM New York: every scanner stock,
Alpaca IEX 1-hour bars), with the zone context of the latest scans and `[📊 SYM]` buttons (`c:SYM`). Muted symbols
are left out, quiet hours make it silent, nothing qualifies = no message. A mover with a headline in the last 3 h
gets one more line under it: `📰 why: <headline> · 40m ago` (`tools/news/headlines.py`).

### Headlines (`headlines.ts`): `/news`, `/news SYM`, [📰 News], `📰 latest`

Free sources, no new keys. **Alpaca News API** (Benzinga, real time, tagged per symbol; stocks, ETFs and crypto as
`BTCUSD`) with the existing `ALPACA_KEY_ID` / `ALPACA_SECRET_KEY`; **RSS** for forex / macro / markets: investingLive
(ex-ForexLive) news, Investing.com forex + economic indicators + stock market news, CNBC top news, CoinDesk (all
answered from Supabase; FXStreet's RSS returns 403 there). Feed text is untrusted: tags stripped, entities decoded,
clipped, HTML-escaped, only `http(s)` links; link previews off. Cached 5 min per source per instance; a failing source
logs `{ev: 'headlines_src', src, status}` only. Symbol -> keywords (`TERMS`, mirrored in
`tools/news/headline_terms.json` for the Python jobs): FX pairs = both currencies' words (EURUSD: euro, ECB, Lagarde,
Germany... + dollar, Fed, Powell, payrolls...), the pair name itself counts most, quote-currency-only matches only
fill in; metals (XAUUSD: gold, bullion + Alpaca tag GLD), indices (US30: Dow + DIA, US500: S&P + SPY, NAS100: Nasdaq +
QQQ, GER40: DAX...), oil (SPOTCRUDE: oil, crude, OPEC + USO), crypto (BTCUSD: bitcoin + tag BTCUSD), stocks: the
Alpaca tag.

- `/news`: the calendar as before, plus `📰 Top headlines` after the key events: the 5 most market-moving of the last
  6 h (macro words, market words, mega caps, source weight, minus noise like price targets / options activity /
  'stocks moving' lists, minus age; near-duplicates merged; at most 3 per source).
- `/news SYM` and the [📰 News] button (callback `n:SYM`, on zones and chart replies): the last ~6 headlines of 3 days
  with time ago + Calgary clock, source, a one-line summary, the link.
- Zones / symbol / chart replies: one line `📰 latest: <headline> · 2h ago` when there is one from the last 24 h
  (fetched alongside the reply, never waits more than 3.5 s).
- Pushed, calm (no new message types except the optional breaking alert): the hourly big moves add `📰 why:` lines; the
  6 AM brief adds `📰 Overnight headlines` (top 5 of ~14 h) + `Your symbols` (newest headline per held / watched
  symbol, from the prefs API `open` + `watch`).
- **Breaking alert** (`supabase/functions/trader-coach/breaking.ts`, on the coach's 10-minute tick): ONE message when
  Alpaca tags a fresh article (last 30 min, at most 3 tickers, not noise) with a symbol on the `/watch` list or an open
  journal position. Max 1 per symbol per 3 h and 6 a Calgary day (dedupe in `rfx_coach_events`, kind `news`); muted
  symbols skipped; nothing during quiet hours (that news lands in the 6 AM brief). Plain FX pairs have no Alpaca tag,
  so they get none; metals / US indices / oil go through their ETF tag. Buttons: [📰 More SYM] [📊 Chart SYM].
- Sample: `.github/workflows/telegram-preview.yml` with `headlines: true` sends ONE `🧪 Sample headlines` message.

## Journal (trader coach) — `journal.ts`

Owned by the trader coach (`supabase/functions/trader-coach`, see its README). `index.ts` calls
`journalRoute(msg, { sbUrl, sbKey })` before `handle()` for every owner message; `null` = not a journal message.

- A **reply** to the coach's `📝 EURUSD buy 1.0850 — why did you take it?` prompt (its `message_id` is in
  `public.rfx_coach_prompts`) is saved as that trade's note in `public.rfx_journal` (`notes[tradeId].note`, `updatedAt`
  like the app's `saveNote`, so the app's merge keeps it). Replies to any other message fall through to the commands.
- **`/took EURUSD buy 1.0850 sl 1.0820 tp 1.0910`** adds a plan (the app's `Plan`, `status: 'planned'`) to the
  journal's `plans`; it shows in the Planner after the app syncs.
- Writes touch only the owner's row and one column, read-modify-write with optimistic concurrency on `updated_at`.
- `journal.ts` imports `../trader-coach/core.ts` (and its generated `app-core.js`): the raw-GitHub deploy entry resolves
  them; a file-list deploy must include `trader-coach/core.ts` and `trader-coach/app-core.js` too.
- Token-free: replies go back in the webhook response. Only the coach's PROMPT is a push, which needs the optional
  `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` function secrets.
