# RamanFX app: UX/UI and usability audit (2026-10-26)

Scope: every page except the stock scanner (`/scanner`, `/scanner/:ticker`). Includes Home, Planner, Journal, Trades, Learn (lesson reader, listen player, sections, Kevin's podcasts), Checklist (+PDF), Zones, Tools, Sandbox, More sheet, Welcome, Sign-in, the shell and Settings, plus the other More pages (Reports, Calendar, Heat maps, MAE/MFE, Guru, Playbook, Strategies, Risk, Calculator, Chart, News, Notebook, Ask, Bot guide, Guide).

## Method

- Production build (`npm run build` + `vite preview`), Playwright Chromium at 375x667, 390x844, 768x1024 and 1280x800 (touch and mobile emulation below 800px), dark and light themes.
- Sign-in bypass without credentials: the same approach as `scripts/a11y.mjs`. A dummy Supabase session goes into localStorage, `navigator.onLine` is forced false and Supabase/TradingView requests are aborted, so the app runs in offline mode on local data.
- Worst-case data: the dev `worst` fixture from `src/data/worstCase.ts` (40 trades with 7-figure P&L, long broker symbols and multi-week holds), plus a long notebook entry, seeded into localStorage. The empty state (Welcome) and the signed-out state (Sign-in) were checked separately.
- Automated checks on every route: horizontal overflow, controls below 44px on touch, icon-only buttons and links without a name, axe-core WCAG 2.1 A/AA (contrast included), console and page errors, and the last content's position against the floating tab bar after scrolling to the bottom. Flows: More sheet, lesson reader with the listen player, Kevin's podcasts expanded, command palette, trade detail, checklist Memorize mode, new plan wizard, Welcome and Sign-in.
- Screenshots: `/tmp/claude-0/-home-user/3ca4625b-e0ba-5998-9044-928583dca530/scratchpad/audit-app/before` and `/tmp/claude-0/-home-user/3ca4625b-e0ba-5998-9044-928583dca530/scratchpad/audit-app/after` (`<theme>-<viewport>-<route>.png`, `flow-*.png`, `report.json`).

## Overall

The app was already in good shape. There was no horizontal overflow at any viewport, no content was hidden under the floating tab bar (the `pb-28` clearance holds on every page), there were no runtime errors (the only console errors were the deliberately blocked Supabase fetches), and axe reported no contrast or labelling violations in either theme. All findings were about touch ergonomics on the owner's iPhone, plus one information-architecture issue on Learn.

Note: full-page screenshots look blurred at the top. That is the iOS-style scroll-edge blur layer being captured, not a bug.

## Findings

| ID | Page | Severity | Issue | Status |
|----|------|----------|-------|--------|
| UX-01 | Shell header (all pages, phone) | Medium | The sync, hide-amounts and theme icon buttons are 36x36, under the 44pt iOS minimum. They are the most-tapped controls on the phone. | Fixed: `touch:h-11 touch:w-11` (pointer-coarse only, desktop unchanged) |
| UX-02 | Learn (phone/tablet) | Medium | The mentor picker is 8 stacked full-width rows (~360px), so the lesson list starts below the fold. Rows are 36px tall. | Fixed: 2-column grid below `lg` (Glossary and Flashcards span both columns), rows at least 44px on touch, long labels wrap instead of truncating. Desktop sidebar unchanged |
| UX-03 | Checklist | Medium | Stage-jump chips (0-7, Never, See it) are 36x36, and their accessible names are just "0", "1"… | Fixed: 44px on touch; `aria-label="Jump to Stage n · title"` |
| UX-04 | Tools | Medium | View / Download / Copy code buttons are 32px tall (h-8), and the compact download icon button is 39x32. | Fixed: `touch:h-11` |
| UX-05 | Bot guide | Medium | Two horizontally scrollable tables can't be reached by keyboard (axe `scrollable-region-focusable`, both themes). | Fixed: `tabIndex=0`, `role=region` with a label, focus ring |
| UX-06 | Planner wizard | Medium | The Close-planner X is 32x32 at the top-left corner of the wizard. | Fixed: 44px on touch |
| UX-07 | Guru | Medium | Previous/next rule buttons are 32x32, and the "Open lesson n" link is 19px tall. | Fixed: 44px on touch |
| UX-08 | Dashboard / P&L calendar card | Medium | The pre-session checklist "Edit" link has a 21x32 target; the month previous/next buttons are 36px. | Fixed: 44px hit area (negative margin, no layout shift); month nav 44px on touch |
| UX-09 | Trades (phone) | Low | The search placeholder is cut off mid-word ("Search symbol, ticke"). | Fixed: shorter phone placeholder "Symbol, ticket, tag…" (the aria-label is unchanged) |
| UX-10 | Dashboard KPI info tips | Low | Info icons are 33x33 on touch (they already have an enlarged negative-margin hit area). | Accepted: meets WCAG 2.2 AA (24px); enlarging further would crowd KPI labels |
| UX-11 | Shared `Segmented` size sm ($/R, All/Active filters) | Low | 36px tall on phone. | Open: a shared kit component used app-wide. Changing it needs a layout pass on every page |
| UX-12 | Playbook | Low | Trend buttons (up/down/sideways) are 21x40 inside a 3-column grid at 375px. They are labelled and meet the 24px minimum height. | Open: would need a layout change (stack the HTF/ITF/ETF cards on phone) |
| UX-13 | P&L calendar (year), Heat maps | Low | Day cells are 18-35px. | Accepted: a dense data visualisation; the cells are labelled and open a peek |
| UX-14 | Trades list rows (phone) | Low | The meta line truncates ("26 Oct 10:07 · 25 lots · 4…") with long holds. | Accepted: the full data is one tap away in the trade detail |
| UX-15 | Planner (phone) | Low | The date-range picker shows on the Planner and costs ~50px of height even in the new-plan wizard. | Open: product decision (the Planner is marked `scoped` in the shell nav) |
| UX-16 | Welcome (offline + stale session) | Low | The "Sync now" button can stay on "Syncing…" while offline. This was seen only in the test harness. | Open: needs a real-device repro |
| UX-17 | Risk | Info | The audit flagged 37 "unlabelled" links. They are lesson links inside closed `<details>`, so this is a false positive. | No action |

## Verification

- `npx tsc --noEmit -p .`: clean. `npx vitest run`: 148/148. `npm run build`: OK.
- Re-audit of the changed pages (375 and 768, both themes): no overflow, no axe violations, no hidden content. Sub-44px controls on Learn, Checklist, Tools, Bot guide, Trades, Zones, Sandbox and Settings went from 4-12 per page to 0 (only the visually hidden skip link remains).

## Files changed

`src/pages/{Learn,Checklist,Tools,BotGuide,Planner,Guru,Dashboard,Trades}.tsx`, `src/ui/MonthCalendar.tsx` and `src/ui/Shell.tsx`. The Shell change is minimal: touch-only size classes on four header buttons.
