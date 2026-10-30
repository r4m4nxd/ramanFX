#!/usr/bin/env bash
# Generated data lives on the `data` branch, never on main (Vercel Hobby: ~100 deployments / 24 h, and a build
# cancelled by the Ignored Build Step still counts; vercel.json git.deploymentEnabled.data = false, so pushes to `data`
# create no deployment at all). Main gets only human / feature commits. See .github/workflows/README.md.
#
#   bash scripts/data-branch.sh pull
#       Overlays the newest copy of EVERY data path (DATA_PATHS below) from the data branch onto the working tree of
#       the main checkout, so a job reads its previous state (dedupe state, last latest.json) and the other jobs'
#       outputs (brief.py: fx / scanner / fundamentals; movers: fx / scanner; fundamentals: fx / events.json / scanner
#       index / universe.csv) at the usual paths (except PULL_SKIP: qa/bars). A path the data branch does not have keeps main's copy (fallback).
#       Only the working tree changes (never main's index); nothing is ever committed to main.
#
#   bash scripts/data-branch.sh push "commit message" PATH... [--keep PATH...]
#       Publishes PATH... (files or folders, as they are now in the working tree) to the data branch: a fresh
#       depth-1 worktree of the data tip, each PATH replaced by the working-tree copy (deletions included), the
#       --keep paths left as on the tip (a file inside PATH that another job owns, e.g. public/fx/backtest.json), one
#       commit, push. A rejected push (another job pushed first) starts over from the new tip, up to 6 times with a
#       growing pause. Each job owns its PATHs (and its workflow concurrency group serializes its runs), so starting
#       over never loses another job's update. Exit 1 (and a ::error::) when it could not push.
set -uo pipefail

BRANCH="${DATA_BRANCH:-data}"
REMOTE="${DATA_REMOTE:-origin}"
WT="${RUNNER_TEMP:-${TMPDIR:-/tmp}}/rfx-data-branch"
# Every path a scheduled / automated job writes. Keep in sync with the workflows (src/core/vercelGuard.test.ts checks
# that each workflow pushes only these, and only to the data branch).
DATA_PATHS=(
  public/fx
  public/scanner
  public/movers
  public/fundamentals
  public/insiders
  tools/reminders/events.json
  tools/reminders/state.json
  tools/briefing/state.json
  tools/stock_scanner/universe.csv
  tools/stock_scanner/top_liquid.csv
  docs/research/FX_Backtest.md
  docs/research/Stock_Backtest.md
  docs/research/arrival_study
  qa/bars
)
# Data paths `pull` leaves alone: no job reads them back, and they are large (qa/bars: the long-history QA bar sets of
# qa-bars.yml, ~10 MB, read by chart QA from a local checkout of the data branch, scripts/qa-bars.ts).
PULL_SKIP=(qa/bars)

is_data_path() {
  local p="${1%/}" d
  for d in "${DATA_PATHS[@]}"; do [ "$p" = "$d" ] || [[ "$p" == "$d/"* ]] && return 0; done
  return 1
}

pull() {
  if ! git fetch -q --depth=1 "$REMOTE" "$BRANCH" 2>/dev/null; then
    echo "::warning::data-branch: no '$BRANCH' branch on $REMOTE yet: main's copy of the data is used"
    return 0
  fi
  local tip p n=0
  tip=$(git rev-parse FETCH_HEAD)
  for p in "${DATA_PATHS[@]}"; do
    [[ " ${PULL_SKIP[*]} " == *" $p "* ]] && continue
    if git cat-file -e "$tip:$p" 2>/dev/null; then
      rm -rf "$p"
      git archive --format=tar "$tip" -- "$p" | tar -xf - || { echo "::error::data-branch: could not read $p from $BRANCH"; return 1; }
      n=$((n + 1))
    else
      echo "data-branch: $p not on $BRANCH: main's copy kept"
    fi
  done
  echo "data-branch: $n data paths from $BRANCH @ ${tip:0:7}"
}

push() {
  local msg="${1:-}"; shift || true
  local own=() keep=() mode=own p
  for p in "$@"; do
    if [ "$p" = "--keep" ]; then mode=keep; continue; fi
    p="${p%/}"
    if ! is_data_path "$p"; then echo "::error::data-branch: $p is not a data path (DATA_PATHS in scripts/data-branch.sh)"; return 1; fi
    if [ "$mode" = own ]; then own+=("$p"); else keep+=("$p"); fi
  done
  [ -n "$msg" ] && [ "${#own[@]}" -gt 0 ] || { echo "usage: data-branch.sh push MESSAGE PATH... [--keep PATH...]"; return 2; }
  local name email root i
  name=$(git config user.name || echo 'ramanfx-scanner[bot]')
  email=$(git config user.email || echo '41898282+github-actions[bot]@users.noreply.github.com')
  root=$(pwd)
  for i in 1 2 3 4 5 6; do
    git worktree remove --force "$WT" 2>/dev/null; rm -rf "$WT"; git worktree prune
    if ! git fetch -q --depth=1 "$REMOTE" "$BRANCH"; then echo "data-branch: fetch $BRANCH failed (try $i)"; sleep $((i * 4)); continue; fi
    git worktree add -q --detach "$WT" FETCH_HEAD || { sleep $((i * 4)); continue; }
    for p in "${own[@]}"; do
      rm -rf "${WT:?}/$p"
      if [ -e "$root/$p" ]; then mkdir -p "$(dirname "$WT/$p")"; cp -a "$root/$p" "$WT/$p"; fi
    done
    for p in "${keep[@]}"; do
      rm -rf "${WT:?}/$p"
      git -C "$WT" checkout -q HEAD -- "$p" 2>/dev/null || true
    done
    git -C "$WT" add -A -- .
    if git -C "$WT" diff --cached --quiet; then echo "data-branch: nothing to commit"; git worktree remove --force "$WT"; return 0; fi
    git -C "$WT" -c user.name="$name" -c user.email="$email" commit -q -m "$msg"
    if git -C "$WT" push -q "$REMOTE" "HEAD:refs/heads/$BRANCH"; then
      echo "data-branch: pushed $(git -C "$WT" rev-parse --short HEAD) to $BRANCH: $msg"
      git worktree remove --force "$WT"
      return 0
    fi
    echo "data-branch: push rejected (try $i): starting over from the new $BRANCH tip"
    sleep $((i * 4 + RANDOM % 5))
  done
  echo "::error::data-branch: not pushed to $BRANCH after 6 tries: $msg"
  return 1
}

case "${1:-}" in
  pull) shift; pull ;;
  push) shift; push "$@" ;;
  paths) printf '%s\n' "${DATA_PATHS[@]}" ;;
  *) echo "usage: data-branch.sh pull | push MESSAGE PATH... [--keep PATH...] | paths"; exit 2 ;;
esac
