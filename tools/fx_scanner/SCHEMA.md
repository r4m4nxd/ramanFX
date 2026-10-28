# FX scanner output contract (v1)

Written by `tools/fx_scanner/fxscan.py` every run that saw a new H1 candle (hourly). Sample data (synthetic, `fixture: true`):
`tools/fx_scanner/fixtures/sample/latest.json` + `fixtures/sample/d/<class>.json` (regenerate with
`python3 tools/fx_scanner/fxscan.py --selftest`). Served at `/fx/latest.json` and `/fx/d/<class>.json`.

Conventions: `sym` = Pepperstone symbol (shown everywhere), `oanda` = OANDA instrument (data source only, tooltip).
Times / bar labels = Pepperstone server time (`'YYYY-MM-DDTHH:MM'`, GMT+2 winter / GMT+3 summer: day = 17:00 New
York close, H1 bars on the hour, H4 bars at 00/04/08/12/16/20). Prices are rounded to `digits`; pip distances use `pip` (10^pipLocation;
metals as on Pepperstone MT5: gold / platinum / palladium 0.1, silver 0.01; index CFDs 1). Prices are BID (the MT4 / MT5
chart); a BUY `entry` already includes the spread (fills on the ask), a SELL `stop` / `target` too. `side` = `demand` | `supply`; `tf` = `H1` | `H4` | `D1` | `W1` | `MN` (`3M` = context only).
`cls` = `major` | `cross` | `exotic` | `metal` | `cfd`. `group` = the owner's TradingView watchlist section
(`''` when not on the watchlist), `wl` = on the watchlist.

## public/fx/latest.json

```jsonc
{
  "version": 1,
  "generated": "2026-10-26T21:05:12Z",          // UTC
  "h4": "2026-10-23T16:00",                      // label of the newest closed H4 bar (server time)
  "h4_close_utc": "2026-10-23T21:00:00Z",
  "h1": "2026-10-23T19:00", "h1_close_utc": "2026-10-23T21:00:00Z",   // newest closed H1 bar = the scan's base (null: H4)
  "fixture": false, "partial": false,            // partial = time budget ran out (some instruments stale)
  "broker": "Pepperstone", "feed": "OANDA practice", "clock": "Pepperstone server time (...)",
  "config": { "chain": ["MN","W1","D1","H4","H1"], "context": "3M", "sl_pct": {"H1":20,"H4":15,"D1":10,"W1":5,"MN":3,"3M":2},
              "approach_h": 1.0, "near_h": 1.0, "left_bars": 6, "max_spread_frac": 0.1, "soft_reach_pct": 5.0,
              "gold_usd_min_tf": "D1", "tp_offset_pips": 7.0, "signal_tfs": ["H1","H4","D1"] },
  "counts": { "instruments": 112, "BUY": 2, "SELL": 1, "WATCH": 2, "errors": 0 },
  "classes": [ { "id": "major", "label": "Majors", "n": 7 }, ... ],          // only classes present
  "groups":  [ { "name": "FX MAJORS", "symbols": ["AUDUSD","EURUSD"] }, ... ], // watchlist sections, file order
  "signals": [Signal],          // kind BUY | SELL, watchlist first, then score
  "watch":   [Signal],          // kind WATCH (+ watch_kind)
  "invalidated": [ { "sym","kind","tf","side","entry","reason" } ],          // signals cancelled this run
  "lists": { "demand": { "in": [Item], "left": [Item], "near": [Item] },
             "supply": { "in": [Item], "left": [Item], "near": [Item] } },  // one bucket per instrument
  "map": [Row],                 // every analysed instrument (the market map)
  "blocked": { "<rule short>": 12, ... },        // first failing rule over all listed zones
  "block_labels": { "location": "HTF area not reached", ... },
  "unmapped": [ { "symbol": "PEPPERSTONE:VIX", "section": "INDICES", "note": "not on OANDA" } ],
  "errors": { "<sym>": "HTTPError: ..." },
  "watchlist_source": "watchlist.txt" | "FX_WATCHLIST",
  "instrument_source": "oanda" | "cache" | "fallback",
  "disclaimer": "..."
}
```

### Signal

```jsonc
{
  "kind": "BUY" | "SELL" | "WATCH",              // BUY / SELL only on H1 / H4 / D1 (signal_tfs)
  "watch_kind": "new" | "tested" | "confirm" | "area" | "context",   // only on WATCH: new zone, 2nd / 3rd touch,
                                                // confirmation entry only, W1 / MN area, context-only instrument
  "sym": "EURUSD", "oanda": "EUR_USD", "cls": "major", "group": "FX MAJORS", "wl": true,
  "tv": "PEPPERSTONE:EURUSD", "digits": 5, "pip": 0.0001, "exotic": false,
  "tf": "W1", "side": "demand", "zone_type": "ARR|WOW|STR|...", "pattern": "DBR|RBR|RBD|DBD",
  "proximal": 0.76049, "distal": 0.75758, "touches": 0, "made": "2026-06-06T00:00", "base_start": "...", "zid": "W1:D:...",
  "departure_x": 1.59, "curve": 10.1, "room_r": 46.79,
  "entry": 0.76049, "stop": 0.75728, "target": 0.91076, "target_kind": "zone" | "projection" | null, "rr": 46.79,
  "next_zone": 0.91121, "next_zone_distal": 0.91923, "stop_pct_of_height": 5.0,
  "stop_pips": 32.1, "target_pips": 1502.7, "height_pips": 29.1,
  "price": 0.76117, "to_entry_pips": 6.8,       // + = price still away from the entry on the right side
  "score": 9,                                   // Raja lens 0-10
  "direction": "LONG - REDUCED",                // the entry TF's Raja direction
  "states": { "H1": "UP", "H4": "TURNING DOWN", "D1": "DOWN", "W1": "PULLBACK", "MN": "CHANGED UP", "3M": "TURNING UP" },
  "loc": "inside|top|below|above|untouched|none|unknown", "loc_ok": true, "loc_text": "inside the touched MN demand ...",
  "chain": [ { "tf": "MN", "side": "demand", "proximal": 0.76082, "distal": 0.75754, "touched": true, "entry": false, "nd": 5 },
             { "tf": "W1", "side": "demand", "proximal": 0.76049, "distal": 0.75758, "touched": null, "entry": true, "nd": 5 } ],
  "chain_text": "MN demand 0.76082–0.75754 touched ✓ → W1 entry 0.76049–0.75758",
  "spread_pips": 0.6 | null, "ctx3": "3M: middle · trend TURNING UP",
  "note": "Set and forget: ...", "gold_note": "..." /* XAU_* only */,
  "rules": [ { "status": "pass|fail|warn|unknown|info", "text": "...", "ref": "L7 · L53", "short": "room" } ]
}
```

Rule `short` keys (first = the owner's top-down location rule): `location`, `leg`, `fresh`, `strong`, `direction`,
`reduced`, `curve`, `HTF opposite`, `room`, `sideways`, `no 3rd CP`, `not used`, `clean`, `out of TL`, `trendline`,
`host tested`, `blind`, `market TF`, `near entry`, `spread`, `gold TF`, `weekend` (H1 / H4), `area` (W1 / MN), `context`
(context-only instruments). `touches` counts the lower-TF bars of the forming HTF bar too (H4 bars for D1 / W1 / MN,
H1 bars for H4).

### Item (lists, and `Row.z`)

```jsonc
{ "sym": "US500", "oanda": "SPX500_USD", "cls": "cfd", "group": "INDICES", "wl": true, "px": 5051.65, "digits": 2,
  "tf": "MN", "side": "demand", "sec": "in|left|near", "b": "ID|AD|LD|IS|AS|LS",
  "type": "ARR", "touches": 0, "score": 8, "prox": 5009.54, "dist": 4820.45, "pips": 42.1,   // pips from close to proximal (0 inside)
  "loc": "top", "loc_ok": true, "loc_text": "...", "chain_text": "...",
  "status": "BUY|SELL|<rule short>", "label": "BUY|SELL|<block label>" }
```

Only strong zones (ARR / WOW / STR, ≤ 3 touches, not removed) on H1 / H4 / D1 / W1 / MN (H1 only when located). `in` = close inside, `left` =
touched in the last `left_bars` H4 bars and closed back out, `near` = within `near_h` × the zone height.

### Row (map)

```jsonc
{ "sym", "oanda", "cls", "group", "wl", "digits", "pip", "exotic", "px",
  "b": "IS|AS|LS|M|LD|AD|ID",                 // bucket (M = middle)
  "z": Item | null, "dir": { "H1": "...", "H4": "WAIT", "D1": "...", "W1": "...", "MN": "..." }, "states": { "H4": ..., "3M": ... },
  "sp": 0.6 | null,                          // typical spread, pips
  "sig": "BUY" | "SELL" | "WATCH" | null, "k": "major" }   // k = detail shard id -> /fx/d/<k>.json
```

## public/fx/d/<class>.json (detail shard per class)

```jsonc
{ "generated": "...", "instruments": { "EURUSD": Detail, ... } }
```

Detail = the instrument fields of a Row (`sym`, `oanda`, `cls`, `group`, `wl`, `tv`, `digits`, `pip`, `exotic`) +

```jsonc
{ "price": 0.76117, "date": "2026-10-23T19:00", "h4": "2026-10-23T16:00", "spread_pips": 0.6,   // date = newest closed bar (H1 mid-H4)
  "states": {...}, "dirs": { "H4": "...", ... }, "curves": { "H4": 41.2, ... }, "ctx3": "3M: ...",
  "zones": [ { zone fields of a Signal (tf .. room_r), "pips": 3.5, "loc", "loc_ok", "loc_text" } ],   // nearest 16 (3M: loc "context")
  "hits": [Item-like, all zones in / left / near],
  "checks": [ nearest demand below + nearest supply above: zone fields + plan fields + "pips", "block", "label", "rules", "chain_text" ],
  "signals": ["BUY W1"],
  "bars": { "H1": [...80], "H4": [["2026-10-23T16:00", o, h, l, c], ...80], "D1": [...80], "W1": [...52] } }   // H1 only with H1 data   // ZoneMiniChart MiniBar
```
