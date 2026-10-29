#!/usr/bin/env bash
# Vercel "Ignored Build Step" (vercel.json ignoreCommand). Vercel's contract: exit 0 = SKIP the build, exit 1 = BUILD.
# Skips only when it can PROVE that nothing the built app uses changed; any doubt (shallow clone without the base
# commit, git error, unknown base) builds.
#
# Base: VERCEL_GIT_PREVIOUS_SHA (the last successfully deployed commit of this branch, set by Vercel in the ignored
# build step) so several commits pushed together, or data commits on top of an app change, are all compared;
# without it (first deploy of a branch) HEAD^.
#
# Not app-affecting (bot data and code that never reaches dist/): the scanner / fx / movers / insiders JSON (served live
# from GitHub's `data` branch through the vercel.json rewrites; the scheduled jobs commit there, never to main),
# fundamentals (read by the bot from GitHub), tools/, supabase/, .github/,
# docs/, unit tests. Keep this list in sync with APP_EXCLUDES in supabase/functions/trader-coach/appPaths.ts (a test
# checks both).
EXCLUDES=(
  ':(exclude)public/fx'
  ':(exclude)public/scanner'
  ':(exclude)public/movers'
  ':(exclude)public/insiders'
  ':(exclude)public/fundamentals'
  ':(exclude)tools'
  ':(exclude)supabase'
  ':(exclude).github'
  ':(exclude)docs'
  ':(glob,exclude)src/**/*.test.ts'
  ':(glob,exclude)src/**/*.test.tsx'
)

has() { git cat-file -e "$1^{commit}" 2>/dev/null; }

base="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -n "$base" ]; then
  if ! has "$base"; then
    # Vercel clones shallow: try to reach the last deployed commit, else build.
    timeout 30 git fetch -q --deepen=200 2>/dev/null || true
    if ! has "$base"; then echo "vercel-ignore: last deployed ${base:0:7} not in the clone -> build"; exit 1; fi
  fi
else
  if ! has HEAD^; then echo "vercel-ignore: no previous deploy and no HEAD^ -> build"; exit 1; fi
  base="HEAD^"
fi

git diff --quiet "$base" HEAD -- . "${EXCLUDES[@]}"
rc=$?
if [ "$rc" -eq 0 ]; then echo "vercel-ignore: only data / bot files changed since ${base:0:7} -> skip"; exit 0; fi
if [ "$rc" -eq 1 ]; then echo "vercel-ignore: app files changed since ${base:0:7} -> build"; exit 1; fi
echo "vercel-ignore: git diff failed ($rc) -> build"
exit 1
