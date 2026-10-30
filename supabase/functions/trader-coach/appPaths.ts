// Which repo paths reach the built app (dist/) on Vercel. Everything else is bot data or code that never deploys, so
// commits touching only those paths skip the Vercel build (scripts/vercel-ignore.sh, vercel.json ignoreCommand) and
// the health watchdog's 'app' check (health.ts) does not wait for them to go live. Keep APP_EXCLUDES in sync with the
// EXCLUDES of scripts/vercel-ignore.sh (src/core/vercelGuard.test.ts checks both).
export const APP_EXCLUDES = ['public/fx/', 'public/scanner/', 'public/movers/', 'public/insiders/', 'public/fundamentals/', 'tools/', 'supabase/', '.github/', 'docs/', 'qa/'] as const;
const TEST = /^src\/.*\.test\.tsx?$/;
/** True when a change to this repo path changes the deployed app. */
export const isAppPath = (p: string): boolean => !APP_EXCLUDES.some(x => p.startsWith(x)) && !TEST.test(p);
