# Train my eye: how your marks tune the engine

The **Train my eye** page (`/train`, `src/pages/Train.tsx`) is where the owner marks charts the way they read them.
Each saved chart is scored against what the engine draws on the **same candles**, and later becomes a regression test.
The goal is that ZoneVision, the scanners and the Telegram bot read a chart the way the owner does.

## What gets marked

| Element | How | Stored as (`src/core/training/types.ts`) |
| --- | --- | --- |
| Structure pivots | Tap a candle. Near its high it becomes a **peak** at the high, near its low a **valley** at the low. HH / HL / LH / LL are labelled against the previous pivot of the same type, with a light zigzag between pivots. Long-press or Alt-click removes one. | `pivots[]: { i, kind, p, note }` |
| Trend lines | Tap anchor 1, then anchor 2. Each snaps to the nearer wick. When a line is selected you can drag either anchor up or down to a clean point (it sticks to wick or body ends within 7 px). Then tap the candle that **closed** beyond the line, or choose "No break". Direction is set automatically. | `lines[]: { a{i,p}, b{i,p}, dir, brk, note }` |
| Zones | Drag over the base candle(s). Demand or supply is set by position against the last close, and you can flip it. Proximal and distal snap to body or wick, and the edit panel shows both options. The box starts at the base and extends right. | `zones[]: { side, s, e, prox, dist, note }` |
| Notes | Free text per chart and per element (e.g. "not the top — first lower high"). | `note` |

`i` is the bar index in the chart's own `bars` (0 = oldest). The bars are stored with the marks, because the
published feeds roll forward (`bars_hash` and `as_of` identify them). Storage is Supabase `rfx_training_marks`
(`supabase/migrations/20261030120000_rfx_training_marks.sql`, RLS owner-only via `auth.uid()`). When the table can't be
reached the page saves to this device instead and shows a banner. **Export JSON** downloads every chart.

## What the engine's answer is (`src/core/training/engine.ts`)

The page runs the bot's pure chart modules unchanged, imported read-only from `supabase/functions/telegram-bot`:

* **pivots**: `zvPivots`, ZoneVision real valleys and peaks (swing 2). A swing low is real only if price makes a new
  higher high before undercutting it, and peaks mirror that.
* **lines**: `zvLines` replayed close by close. This gives every up / down line the indicator would have drawn at some
  point, not only today's. Each line ends at its first break (by default the indicator's rule: a whole candle beyond it).
* **zones**: `zonecore.detect`, with `FX_PARAMS` for forex, metals, crypto and CFDs and `RAJA` for stocks. This includes
  zones that were later removed (drawn up to the removal bar).

## Scoring, honestly (`src/core/training/score.ts`)

Your marks are the truth. Matching is one-to-one, greedy and closest first, so one engine line can never "match" two of
yours.

| Element | Match when | Reported |
| --- | --- | --- |
| Pivots | same type, bar within ±1 | recall (yours the engine found), precision (engine's you agree with), F1 |
| Trend lines | same direction, **both** anchors within ±1 bar **and** within 0.1 ATR(14) of price | as pivots |
| Breaks | among matched lines: both unbroken, or both broken within ±1 bar | share of matched lines |
| Zones | same side, start (base) bar within ±1, price-range IoU ≥ 0.6 | as pivots |

Agreement = F1 = 2·matched / (yours + engine's). An element type you did not mark on a chart is left out of that chart's
total. It is never a free 100%. Engine extras you did not mark count against precision, so mark **everything you would
act on** on a chart, not only the best example.

## Parameters to tune

| Parameter | Where today | What the marks tell us |
| --- | --- | --- |
| Swing size | `ZV.swing = 2` (InpTLSwing) | pivots you mark that the engine misses (swing too big) or engine pivots you skip (too small) |
| Real-peak confirmation | `zvPivots`: a swing low counts only after a new higher high (peaks mirrored) | pivots you mark before confirmation, or "first lower high" notes |
| Pivot-1 rule | `zvLines`: the older anchor = the second-newest real pivot | your anchor 1 against the engine's (bar offset) |
| Tangent pivot 2 | `zvFitAnchor` re-anchors the older pivot to the candle poking through the most | lines whose anchor 2 / anchor 1 differ by more than 1 bar |
| Clean-anchor tolerance | `0.05 × ATR` (FitAnchor `tol`), cuts allowed | anchors you dragged off the wick ("clean point" badge) and how far |
| Flatness | TooFlat: < 0.015 ATR per bar or < 1.5 ATR between the anchors | flat lines you draw that the engine drops |
| Break = close | `ENGINE_DEFAULTS.breakRule = 'full'` (whole candle beyond); `'close'` = a close beyond | the break-agreement row; you mark the closing candle |
| Zone base / edges | `zonecore` RAJA / FX_PARAMS: base 1–6 candles, leg ≥ 1.2×, proximal on bodies, distal on wicks, height ≤ 1.5 ATR | zones with IoU < 0.6 where you chose wick edges, or base starts off by more than 1 bar |

## The plan

1. **Mark about 30 charts.** Random chart prefers the markets and regimes (up / down / range) marked least so far:
   forex, metals, crypto, indices, stocks, from 3M to H1 where bars are published. M15 bars are not in the feeds yet,
   so that chip stays disabled.
2. **Export**: GitHub → Actions → *Training marks export*. It runs `tools/training/export_marks.py` with the
   `SUPABASE_SERVICE_ROLE_KEY` secret, available in Actions only and never in the client. It writes
   `src/core/training/fixtures/marks.json` and prints the agreement report. Commit the `training-marks` artifact as that file (workflows never push app files).
   `python3 tools/training/export_marks.py --from training-marks-<date>.json` does the same from the page's export.
3. **Tune with a hold-out split.** Sort the charts by id, use ~70% to search the parameters above (grid over swing,
   break rule, FitAnchor tolerance, flatness, zone edges) to maximise mean F1, and report the score on the held-out
   30% before any change goes into `zvTrend.ts` / `zonecore.ts`. Only take a change that improves the hold-out score.
   Every engine change must keep the ZoneVision MQL / Pine parity tests green, so port it there too.
4. **Lock it in.** `src/core/trainingFixtures.test.ts` runs the engine on every marked chart. Today it is a report
   (`MIN_AGREEMENT = 0`). After tuning, raise the floors to the reached agreement so a later engine change that drifts
   from your eye fails the build. Every new marked chart then becomes a regression test.
