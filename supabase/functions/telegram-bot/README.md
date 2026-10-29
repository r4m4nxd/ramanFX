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

## Optional secret

`TELEGRAM_BOT_TOKEN` as a Supabase function secret (added by the owner in the dashboard, never by tooling): when set,
the function calls `answerCallbackQuery` on button taps (stops the spinner at once, shows a short toast). Without it
everything still works through the webhook response.
