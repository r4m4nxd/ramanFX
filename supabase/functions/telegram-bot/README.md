# telegram-bot (Supabase edge function)

Two-way RamanFX Telegram bot. Telegram POSTs each update to this function; the reply goes back in the HTTP response
body, so the function never needs the bot token. Source: `index.ts` (HTTP, auth, database), `logic.ts` (commands,
pure), `prefs.ts` (alerts / mutes / quiet hours / watchlist), `chart.ts`, `ask.ts`, `news.ts`. Deployed through
`tools/telegram_bot/deploy_entry.ts` (imports this folder at one pinned commit). Setup: `.github/workflows/telegram-webhook.yml`.

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
  "watch":  ["AUDNZD", "AMD"]
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
| `OANDA_API_TOKEN` (practice account) | telegram-bot | **Live FX / metals / CFDs**: `/chart`, `/zones` and a bare symbol fetch the latest OANDA BID candles at request time (H1 / H4 / D1 / W1 / MN, the forming candle included, 30 s cache; Pepperstone names mapped to OANDA through the scan's `oanda` field). Price and zones are live (`live · 7:42 AM`); BUY / SELL / WATCH stay those of the latest scan. `OANDA_ENV=live` switches to the live host. |
| `ALPACA_KEY_ID` + `ALPACA_SECRET_KEY` | telegram-bot | **Live stocks**: daily bars since 2016 (split adjusted; SIP history, IEX when the plan refuses SIP), W1 / MN / 3M built from them, 1-hour bars + the latest trade from the free real-time IEX feed. Adds the 1H stock chart view. |
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
H1 -> H4 -> D1 -> W1 -> MN -> 3M, stocks D1 -> W1 -> MN -> 3M). Picked: never removed, uncrossed first, the row's
in-force up / down line first, most touches, nearest price; only lines that enter the drawn candles' range. Computed on
the chart's candles (live: 250 closed bars, the scanners' 200-bar lookback); with the short published shards (80-120
bars) the scanner's own published lines (`tls`) are used instead. Parity: the same fixtures +
`src/core/telegramTrendParity.test.ts` (every line of every row identical).

### Big moves (hourly)

`tools/movers/movers.py` (`.github/workflows/movers.yml`): ONE message per hour when something moved >= 2x its
20-hour average range (FX: every scanner instrument, OANDA H1; stocks 7:00 AM-5:00 PM New York: every scanner stock,
Alpaca IEX 1-hour bars), with the zone context of the latest scans and `[📊 SYM]` buttons (`c:SYM`). Muted symbols
are left out, quiet hours make it silent, nothing qualifies = no message.

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
