# UX / UI audit: stock scanner (2026-10-26)

Scope: `/scanner` and `/scanner/:ticker` (src/pages/Scanner.tsx, src/pages/Stock.tsx, src/ui/ScanParts.tsx,
src/ui/ZoneMiniChart.tsx, src/ui/ZoneGauge.tsx, src/core/scanner.ts). The rest of the app is audited separately.

Method: production build (`vite preview`) driven by Playwright at 375x667, 390x844, 768x1024 and 1280x800, dark and
light themes, with the selftest fixture (`tools/stock_scanner/fixtures/sample/`) served by request interception (never
copied into `public/`). Extra data sets: a worst case (50 signals, 80-character company names, prices 4,500.00 and
0.0123, missing target / R:R / fundamentals / Seiden parts), an empty scan (the committed placeholder), a network
failure (all scan requests aborted) and an unknown ticker (`/scanner/ZZZZ`). Checks: horizontal overflow, bottom-nav
overlap, truncation, tap targets, axe-core WCAG 2.2 AA, keyboard order and focus rings, error / empty / loading states,
number formatting, information hierarchy, chart legibility, bundle and fetch sizes.

Screenshots: `/tmp/claude-0/-home-user/3ca4625b-e0ba-5998-9044-928583dca530/scratchpad/audit/` (`before_*` / `b_*` =
before, `after_*` / `a_*` = after; `*_<width>_<theme>.png` are full pages at each size and theme).

## Findings

| ID | Page | Severity | Issue | Fix status | Before / after |
|---|---|---|---|---|---|
| S1 | Scanner, Stock, chart | High | Sub-dollar prices collapsed to `0.01`: entry, stop, target, zone, PZ chips and chart labels all read 0.01 for a 0.0123 stock, so the plan was unreadable and wrong-looking. | Fixed: new `px()` formatter in `core/scanner.ts` (2 dp with thousands separators, 3-4 dp below $1) used for every price on both pages; chart labels use the same rule. Unit test added. | `before_tiny_card.png` / `after_tiny_card.png` |
| S2 | Scanner | High | On an iPhone the intro card (description, 3 regime tiles, RFX panel, boxed disclaimer) filled the whole first screen; the search sat below the fold and the first signal started at about 1.6 screens. | Fixed: search moved to the top; regime tiles + RFX index fold into a "Market" row whose summary still shows SPY / QQQ / IWM above or below the 200D and the RFX state (closed on phones, open on tablet / desktop); disclaimer is a single warning line instead of a padded box (text unchanged). Filters now show on the first screen. | `v_scan_0.png` / `a_scan_0.png` |
| S3 | Scanner | Medium | Every BUY card opened its 15-row rule list, so one card was about 2.3 iPhone screens and 25 BUYs made a 43,000 px page. | Fixed: rule lists start closed on the list (the summary still says "14/15 pass"); the stock page keeps them open. Worst-case page 43,214 px to 24,854 px. | `b_worstv_*.png` / `a_worstv_*.png` |
| S4 | Scanner, Stock | Medium | The BUY plan (entry / stop / target / R:R) was 13 px medium, the same weight as secondary stats, so it did not read as the main result. | Fixed: plan values are 16 px semibold (`PLAN_V` in ScanParts), colours unchanged. | `v_scan_1.png` / `a_scan_1.png` |
| S5 | Scanner, Stock | Medium | Network or file errors showed a dead end with no way to retry short of reloading the PWA. | Fixed: "Try again" button (44 px) re-runs the fetch on both pages; the intro card also says the scan could not be loaded instead of "No scan has run yet". | `b_error_top.png` / `a_error_top.png` |
| S6 | Search | Medium | The type-ahead list was `60vh` tall and ran under the fixed bottom nav, hiding the last results. | Fixed: height capped at `min(60vh, 100dvh - 18rem)` with `overscroll-contain`; with the search now at the top, the list ends above the nav (and shrinks with the iOS keyboard). | `before_search.png` / `after_search.png` |
| S7 | Scanner, Stock | Medium | "Seiden odds" toggle was a 24 px tall button on touch screens. | Fixed: 28 px with a mouse, 36 px on coarse pointers (`touch:h-9`, the same pattern as the app's Segmented control); the Raja chip matches so the row stays aligned. | `v_scan_1.png` / `a_scan_1.png` |
| S8 | Stock | Medium | "W1 · MN" stat truncated ("TURNING DOWN · TU..."); Direction and D1 could truncate too. | Fixed: these stats wrap. | `v_stock_0.png` / `a_stock_0.png` |
| S9 | Scanner | Low | Regime tiles: "▼ 200D" broke over two lines in some tiles; direction text was cut at 2 lines. | Fixed: the badge does not wrap, direction gets 3 lines plus a tooltip. | `b_lightv_0.png` / `crop_after_1280.png` |
| S10 | Chart sheet | Low | The enlarged chart's legend mentioned "target (T)" while the chart showed PZ1-PZ3, and did not explain the FV band. | Fixed: legend now covers FV, PZ1 / PZ2 (dotted) and PZ3 (target). | `before_enlarge.png` / `after_enlarge.png` |
| S11 | Stock | Low | Active-zone rows showed a bare "9.0%" with no direction. | Fixed: a small "below" / "above" / "inside" under the percentage. | `v_stock_3.png` / `a_stock_3.png` |
| S12 | Scanner | Low | Card subtitle (name · sector) cut at one line, so the sector was lost on phones. | Fixed: two lines, breaks long words. | `v_scan_1.png` / `a_scan_1.png` |
| S13 | Search | Low | Result hint "demand 4.9%" was ambiguous. | Fixed: "4.9% to demand", same wording as the gauge. | `before_search.png` / `after_search.png` |
| S14 | Scanner, Exit tab | Low | Exit row "Chart" button was 36 px tall. | Fixed: 40 px, like the other card buttons. | (Exit tab) |

Checked and fine: no horizontal overflow at any size; the last card's buttons clear the bottom nav and the safe area;
axe-core WCAG 2.2 AA is clean on both pages in both themes, including the worst-case data; icon buttons (star, enlarge,
chart links) all have labels; focus rings are visible (global `:focus-visible`); the enlarged chart closes with Esc;
the empty scan, unknown ticker and offline states have clear copy; 4,500.00 and 80-character names do not break the
layout; light theme contrast is fine. Performance: Scanner chunk 15 kB (5.4 kB gzip), Stock 9 kB, ScanParts 18 kB
(6.6 kB gzip); `latest.json` sample 60 kB raw, real files estimated at ~300 kB raw / ~80 kB gzip with 50 signals'
bars; a stock page loads one ~60 kB gzip shard. No console errors from the scanner (only the aborted Supabase calls of the
test setup).

## Remaining low-priority items (not changed)

- **Stock page, BUY today**: the entry / stop / target block is in the second card, about one screen down, after the
  chart, the direction stats and the nearest zones. Consider moving the rule-check card above the stats when
  `signal === 'BUY'`.
- **Segmented control keyboard model** (shared `kit.tsx`, used across the app): each radio is a Tab stop and arrow keys
  do nothing. ARIA radiogroups expect one Tab stop and arrow keys between options. This is an app-wide change, so it was left alone.
- **Segmented / sector chips height**: 32 / 28 px with a mouse, 40 / 36 px on touch screens. Under the 44 px guideline but
  consistent with the rest of the app and above the WCAG 2.2 24 px minimum.
- **Index filter row scrolls sideways** at 375-390 px ("Russell 2000" is cut) with no fade to show there is more.
  Shorter labels (S&P / NDX / Dow / R2K, as on the cards) would fit.
- **Ticker heading link** on cards is 21 px tall. The "Zones" button on the same card is the large target, so this is fine.
- **Jargon**: sort labels "Raja" / "Seiden" assume the reader knows the mentors' scores ("Raja score", "Seiden odds"
  would be clearer); the rule reference "Pinndx-inspired" and the R:R of 18.2 come from the Python output and are left
  as they are.
- **Chart labels** drop the thousands separator above 1,000 ("4500"), by design, to fit the 58 px label column.
- **Stock page fundamentals** sit in a bordered `details` rather than a Card, so their padding differs slightly from the cards
  above them.
- **Re-renders**: `sortSignals` runs on every render of Scanner (not memoised); harmless at 50 signals.
