# Workflows and the `data` branch

**Rule: no automated job commits to `main`.** Vercel Hobby allows about 100 deployments in 24 hours and a build that
the Ignored Build Step cancels still counts, while the scheduled jobs commit 50-100 times a day. So every generated
file goes to the **`data`** branch, which never deploys (`vercel.json` `git.deploymentEnabled.data = false`; the
`audio/*` and `claude/*` branches never deploy either). `main` gets only human / feature commits.
`src/core/vercelGuard.test.ts` fails if a scheduled workflow runs `git add` / `git commit` / `git push`, or if any
workflow pushes a path that is not a data path.

## The pattern (`scripts/data-branch.sh`)

```yaml
permissions:
  contents: write
concurrency:
  group: my-job                 # one run of this job at a time (it owns its data paths)
  cancel-in-progress: false
steps:
  - uses: actions/checkout@v4   # code: main
  - name: Data from the data branch
    run: bash scripts/data-branch.sh pull          # newest data at the usual paths (state, last outputs, other jobs' files)
  # ... run the tool: it reads and writes public/... / tools/.../state.json exactly as before ...
  - name: Commit
    if: ${{ !cancelled() }}
    run: |
      git config user.name "ramanfx-scanner[bot]"
      git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
      bash scripts/data-branch.sh push "my-job: $(date -u +%Y-%m-%dT%H:%MZ)" public/my-job \
        || { echo "::error::my-job not pushed"; exit 1; }
```

- `pull` overlays every data path (`DATA_PATHS` in the script) from the `data` tip onto the working tree; a path the
  data branch does not have keeps main's copy. Only the working tree changes; nothing is committed on main.
- `push MESSAGE PATH... [--keep PATH...]` copies the PATHs into a fresh worktree of the `data` tip (deletions too),
  commits once and pushes; a rejected push starts over from the new tip (6 tries, growing pause) and the step fails
  when it could not push. `--keep` leaves a file inside PATH as it is on the tip (a file another job owns, e.g.
  `public/fx/backtest.json` inside the FX scan's `public/fx`).
- Each job pushes only the paths it owns; different jobs touch different paths, so they never undo each other.
- A **new data path** (e.g. `public/insiders` for an insider-buys job): add it to `DATA_PATHS` in
  `scripts/data-branch.sh` (`public/insiders` is already there), to the excludes of `scripts/vercel-ignore.sh` and
  `APP_EXCLUDES` in `supabase/functions/trader-coach/appPaths.ts`, and read it from
  `https://raw.githubusercontent.com/r4m4nxd/ramanFX/data/...` (the bot's `load()` already tries `data` first, then
  main). An app page reading it needs a `vercel.json` rewrite to `/data/public/...` like `/fx`, `/scanner`, `/movers`.

## Who writes what

| Workflow | Trigger | Pushes to `data` | Reads back (from `data`) |
| --- | --- | --- | --- |
| `fx-scan.yml` | every 10 min (+ coach) | `public/fx` (keeps `backtest.json`, `realign.json`; incl. `arrivals.json`: the Raja arrival alerts' state + open realignment areas) | `public/fx/state.json`, `latest.json`, `d/*` (crypto merge), `arrivals.json`, `realign.json` |
| `realign.yml` | every 15 min in the forex week (+ coach) | `public/fx/realign.json` (the M15 / H1 confirmations sent) | `public/fx/arrivals.json` (areas price is in), `public/scanner/arrivals.json` (shared daily cap) |
| `movers.yml` | hourly (+ coach) | `public/movers` | `public/fx/latest.json`, `public/scanner/{latest,index,t/*}.json` |
| `stock-scan.yml` | weekdays after the close | `public/scanner` (keeps `backtest.json`; incl. `arrivals.json`: stock arrival alerts' state), `tools/stock_scanner/{universe,top_liquid}.csv` | `public/scanner/latest.json` (already scanned?), `universe.csv`, `public/fx/latest.json` |
| `fundamentals.yml` | nightly | `public/fundamentals` | `public/fundamentals/stocks.json`, `public/fx/latest.json`, `public/scanner/index.json`, `universe.csv`, `tools/reminders/events.json` |
| `briefing.yml` | weekday mornings | `tools/briefing/state.json` | that state, `public/fx/d/*`, `public/scanner/*`, `public/fundamentals/stocks.json`, `tools/reminders/events.json` |
| `reminders.yml` | weekday ticks | `tools/reminders/{events,state}.json` | the same |
| `fx-backtest.yml`, `stock-backtest.yml`, `backtest-publish.yml` | manual | `public/{fx,scanner}/backtest.json`, `docs/research/{FX,Stock}_Backtest.md` | `universe.csv`, the scans |
| `arrival-study.yml` | manual | `docs/research/arrival_study/` (report, trades.json, PNG charts; also an artifact) | `top_liquid.csv` |
| `telegram-preview.yml` | manual | nothing | the published scans |
| `market-hours.yml` | manual / research code push | **main** (the only exception): `public/research/*` is bundled into the app, so it must deploy | `universe.csv` |
| `training-export.yml` | manual | nothing: `src/core/training/fixtures/marks.json` comes back as an artifact, committed by hand (it is a test fixture) | Supabase `rfx_training_marks` (service key secret `SUPABASE_SERVICE_ROLE_KEY`) |
| `qa-bars.yml` | manual | `qa/bars/<SYM>/<TF>.json` + `index.json`: long-history BID bars (MN since 2005 ... M15 6 weeks, MT5 server-time labels) for chart QA, read by `scripts/qa-bars.ts` from a local checkout of `data`; `pull` skips it (`PULL_SKIP`) | nothing |

Caches that are not files in git (candles, Telegram dedupe, SEC data) stay in the actions cache as before.

## Readers

- App: `vercel.json` rewrites `/fx`, `/scanner`, `/movers` JSON to `raw.githubusercontent.com/r4m4nxd/ramanFX/data/public/...`.
- Bot (`supabase/functions/telegram-bot/index.ts` `load()`): the app URL, then `RAW_DATA` (data branch), then main;
  `events.json` from the data branch, then main.
- Watchdog (`supabase/functions/trader-coach/health.ts`): file freshness and the app-data check read the data branch
  (the FX file check is also the "data branch gets new commits" check).
- `main` keeps the last data snapshot from before the switch (harmless; a fallback only).
