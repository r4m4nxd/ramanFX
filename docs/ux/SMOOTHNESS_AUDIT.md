# Smoothness audit (shell level)

Branch `ux-smooth-A`. Scope: global/shell-level friction across every route, measured in a production build (`vite preview`),
iPhone 14 emulation (390x844 @3x, touch, mobile) and desktop 1280x800, with 90 seeded trades, auth stubbed, Supabase blocked
and the app forced offline. The audit script (Playwright) navigates client-side to each of the 26 routes and watches every
frame until real content paints, then records layout shifts, long tasks, skeleton/blank frames and static checks (inputs under
16px, tap targets, press feedback, horizontal overflow, nested scrollers, ungated `:hover`, `100vh`), plus back-navigation
scroll restoration and the More sheet.

Caveat: emulation can't reproduce sticky hover, the URL bar, the keyboard, rubber-banding or real GPU cost. Numbers are one run
each (timings vary by roughly ±30ms); confirm the feel on a real iPhone home-screen install.

Pages owned by another agent (`Planner.tsx`, `Checklist.tsx`, `Learn.tsx`) were measured but not edited.

## What was already good

The shell was already in good shape: tap highlight off, `touch-action: manipulation`, 16px fields on touch (0 zooming inputs on
phone), `viewport-fit=cover` with safe-area padding on the header, tab bar, sheets and toasts, a counted scroll lock that also
works on iOS, a drag-to-dismiss sheet with momentum projection, a reduced-motion and reduced-transparency path, swipe-to-dismiss
toasts, hover gated by `hoverOnlyWhenSupported`, and page transitions via View Transitions. Back navigation already restores
scroll (Trades list scrolled to 900px, then open a trade, then back: 900px).

## Findings, ranked by impact

| # | Finding | Evidence (before) | Fix | After |
|---|---|---|---|---|
| 1 | **Skeleton flash on the first visit to almost every page**, even after the idle preload had downloaded the chunk. `React.lazy` always suspends on its first render (it only sees the resolved promise a microtask later), so Suspense swapped the whole page for the skeleton for 1 to 8 frames. The soft page transition even waited up to 18 frames for it to go away. Learn, Ask, Sandbox and Bot guide weren't preloaded at all. | Skeleton on 17/26 routes (phone), 13/26 (desktop); 33 blank frames in total on phone | `src/routes.tsx`: `lazyPage()` renders the loaded module synchronously once it's in memory and only falls back to `React.lazy` before that. Every page is in the idle preload (heavy reading pages last), and links prefetch on pointer-enter, touch-down and focus (sidebar, landscape rail, More tiles and list, tab bar, the highlighted command-palette page). | **0/26 skeletons, 0 blank frames** on both devices. Summed time to content across 26 routes: phone 2695 to 2078ms (−23%), desktop 3701 to 2119ms (−43%); median phone 74 to 55ms. Long tasks during navigation: phone 22 to 16, desktop 27 to 19 (no double commit any more). |
| 2 | **Many tappables had no press feedback on touch** (segment pills, chips, text links, filter buttons, rows that aren't `.press`). On a phone they don't respond until the finger lifts. | 380 controls with no `:active` style (phone, all routes) | A global, zero-specificity touch fallback in `index.css`: tappables with no press style of their own dim to 0.7 on touch-down (iOS style), after a 40ms delay so a scroll that starts on a row doesn't flicker it. Anything with its own squeeze (`.btn-base`, `.press`, the tab bar, heat cells, Tailwind `active:`) is left alone. Coarse pointers only, so desktop is unchanged. | 121 left (almost all heat-map/calendar cells, which have their own active state) |
| 3 | **Page transition too long and too costly for something done tens of times a session**: 420ms, animating a 3px `filter: blur` over a full-screen snapshot (1170x2532 at 3x). The fallback `.page-in` was 500ms with a 6px blur. | n/a (costs GPU; emulation can't measure it) | Root page transition 420 to 340ms. On touch screens: 300ms, opacity and translate only (compositor), same overlap and drift. `.page-in` 500 to 360ms (300ms with no blur on touch). Reduced motion is unchanged (plain fade). | Same look, roughly 30% shorter, no full-screen filter on phones |
| 4 | **The tab bar gave no touch-down feedback and tapping the current tab did nothing.** | Tab icons had colour only; tapping the active tab was a no-op | The icon gives under the finger (scale 0.86, 100ms ease-out) and springs back (`--ease-spring`). Tapping the active tab smooth-scrolls the page to the top (iOS convention; instant under reduced motion). | Checked: Trades scrolled to 900px, tap Trades, back at 0 |
| 5 | **Sticky hover on touch**: `.btn-primary:hover` and the light-theme primary hover weren't gated, so a tapped primary button kept its hover fill. | 3 ungated `:hover` rules | Wrapped in `@media (hover: hover) and (pointer: fine)` | 0 |
| 6 | **Ask page overflowed sideways on a phone**: a long "Try" question was a no-wrap, no-shrink pill, and the source filter chips were 28px tall. | Horizontal overflow of 21px; 8 targets under 32px | Example questions wrap (min 44px on touch, shrink to the card width); filter chips are 36px on touch | 0px overflow; 0 targets under 32px |
| 7 | **`100vh` in the shell and the chart peek**: on iOS Safari `100vh` is the URL-bar-collapsed height. | `min-h-screen` on the shell root; Peek's `calc(100vh - y)` puts the popover off by the URL-bar height | Shell `min-h-dvh` (keeping `min-h-screen` as a fallback); Peek uses `window.innerHeight` | The remaining `100vh` rules are desktop-only (sidebar) or in owned pages |
| 8 | Motion values were scattered as magic numbers in JS | Sheet exit 0.2, backdrop on the default curve | `dur` tokens in `kit.tsx` (press 0.1, fast 0.15, exit 0.2, base 0.25, slow 0.45), the JS twin of `--motion-*`; the Sheet backdrop uses an explicit `ease` | Consistent curves between the backdrop and the panel |

Measured but **not fixed** (content-level, or owned elsewhere):

- **Guru**: 450 to 500ms long task on entry (phone and desktop), the slowest route by far. The projection and coaching run
  synchronously on mount. See the backlog.
- **Calendar / Trades**: 130 to 340ms of long tasks on the first visit (year grid and table build).
- **Chart**: CLS 0.05 on phone. The TradingView embed resizes `main` once it loads (blocked in this audit, so it may differ live).
- **Lesson reader (`/learn?l=1`)**: CLS 0.028 when lesson sections mount (Learn.tsx is owned by the other agent).
- **Dense data grids** (P&L calendar year view, heat maps, playbook alignment chips): 90 to 380 targets under 32px. These are
  inherent to the visualisation and the tap-and-hold peek already covers them, but the backlog suggests a zoomed month view.
- Sandbox measures as "blank" only because its content is an iframe. A spinner shows for about 6 frames, which is fine.

## Before/after summary (sums across all 26 routes)

| Metric | Phone before | Phone after | Desktop before | Desktop after |
|---|---|---|---|---|
| Routes that flashed the skeleton | 17 | **0** | 13 | **0** |
| Blank frames during navigation | 33 | **0** | 20 | **0** |
| Summed time to content (ms) | 2695 | **2078** | 3701 | **2119** |
| Long tasks during navigation | 22 (1879ms) | **16 (1750ms)** | 27 (2550ms) | **19 (1854ms)** |
| CLS (sum) | 0.132 | 0.129 | 0.015 | 0.024 (lesson reader, owned) |
| Controls with no press feedback | 380 | **121** | (unchanged on purpose) | |
| Ungated `:hover` rules | 3 | **0** | 3 | **0** |
| Routes with horizontal overflow | 1 (Ask) | **0** | 0 | 0 |
| Zooming inputs (<16px, touch) | 0 | 0 | | |
| Back-nav scroll restore (Trades) | 900 to 900 | 900 to 900 | 900 to 900 | 900 to 900 |
| More sheet: scroll lock / drag handle | yes / yes | yes / yes | | |

Screenshots: `before-*` / `after-*` for every route and device, in the session scratchpad (`ux_audit/`).

## Files changed

- `src/routes.tsx` (new): `lazyPage`, `prefetchRoute`, `prefetchProps`, `PRELOAD`.
- `src/App.tsx`: routes from `src/routes.tsx`; the idle preload primes the lazy pages themselves.
- `src/ui/Shell.tsx`: prefetch on every nav link and on the highlighted command-palette page; `min-h-dvh`.
- `src/ui/GlassTabBar.tsx`: prefetch on touch-down, icon press squeeze, tap the active tab to scroll to the top.
- `src/ui/kit.tsx`: `dur` motion tokens, explicit Sheet backdrop timing, Peek without `100vh`.
- `src/index.css`: gated primary hover, touch press fallback, tab-bar press, shorter page transitions with no blur on touch.
- `src/pages/Ask.tsx`: wrapping example pills, 36px filter chips on touch.

## Backlog: further engaging-UX ideas (per page)

Effort: S = under half a day, M = 1 to 2 days, L = more than 2 days.

**Shell / global**
- S: Per-tab scroll memory, like iOS. Switching Trades, then Home, then back to Trades returns to where you were (key by tab path, restore after the page's first paint).
- S: `scroll-padding-top` / `scroll-padding-bottom` equal to the floating header and tab bar, so focused fields and anchor jumps never land under the glass.
- S: A thin top progress hairline for the rare slow navigation (only if content takes more than 150ms), instead of the skeleton.
- M: Wrap heavy page mounts in `startTransition` (outside the view-transition `flushSync`) so the old page stays interactive while Guru or Calendar compute.
- M: Pull-to-sync on Dashboard and Journal (rubber band past the top triggers `syncNow`, with a spring-loaded spinner).
- M: Haptics where iOS allows: a `navigator.vibrate` no-op on iOS, so mirror commits with a 1-frame visual "tick" (scale 0.98 to 1) on save, delete and import success.

**Dashboard**
- S: Count-up only on today's P&L tile when it changed since the last visit (already supported by `CountUp id`), and a soft pulse on a new trade synced.
- M: Long-press on a KPI tile opens a Peek with its definition and a 30-day sparkline (replaces the info-icon tooltips, which are under 44px).

**Journal**
- S: Swipe left/right between days in the day view (horizontal pager with `touch-action: pan-y`), with a spring and momentum projection.
- M: An inline "how did today go?" mood/rating chip row with a satisfying select animation, which feeds Reports.

**Trades / Trade detail**
- S: Sticky filter pill row that condenses on scroll (same scroll-linked pattern as the large title).
- M: Swipe a trade row to tag it (setup or mistake) without opening it; undo toast.
- M: Prev/next trade swipe on the detail page, with the hero card morphing between trades.

**Reports / Heat maps / Calendar**
- S: Month view on phones by default, with a pinch or tap to zoom into a week (fixes the under-32px cells).
- M: Cross-highlight: tapping a symbol bar highlights its cells in the heat map and calendar.

**Guru**
- M: Move the projection into a Web Worker or idle chunks; show the hero number first and fill the charts after (removes the roughly 450ms long task).

**Planner** (owned elsewhere, ideas only)
- S: Step dots that fill with a spring as each step completes; a confetti-free "ready to trade" check with one haptic tick.
- M: Drag zones on the chart with rubber-banding at price limits.

**Checklist** (owned elsewhere)
- S: Tick animation with a stroke-draw check (150ms) and a progress ring in the header.
- M: "Memorize" mode: flashcards with a swipe-to-know / swipe-to-review gesture.

**Learn / Reader** (owned elsewhere)
- S: Reserve height for lesson sections and figures to remove the 0.028 CLS.
- S: A reading-progress hairline under the bar; "resume where you left off" chip on the lesson list.
- M: Reader as a full-height sheet with drag-to-dismiss and page-curl-free horizontal paging.

**Ask**
- S: Stream results in with a 40ms stagger and highlight the matched phrase.
- M: A model download progress ring on the Ask button (first use only), with an "it's on your device" reassurance.

**Calculator / Risk**
- S: Use `inputmode="decimal"` and `enterkeyhint="next"` on all numeric fields; tapping the result copies it with a check morph.
- S: Animate the lot-size result with `CountUp` when inputs change (in place, no layout shift).

**Tools / Bot guide / Guide**
- S: Sticky section index that highlights as you scroll (scroll-driven, no JS on modern browsers).

**Settings**
- S: The theme switch already dissolves; also mirror it to `theme-color` with the same 600ms ease so the status bar doesn't snap.
