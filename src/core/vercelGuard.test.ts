// @vitest-environment node
// Vercel Hobby allows 100 deployments a day. These guards keep the setup that keeps us far below it:
//   - vercel.json: data served live from GitHub (rewrites), data folders out of dist/, the ignore script, no preview
//     deployments of the claude/* working branches, version.json for the health watchdog;
//   - scripts/vercel-ignore.sh: exit 0 (skip) ONLY when nothing app-affecting changed since the last deploy; tested on
//     real temp git repos incl. shallow clones;
//   - the scheduled / automated workflows commit their data ONLY to the `data` branch (scripts/data-branch.sh), which
//     never deploys (git.deploymentEnabled.data = false): a build cancelled by the ignore step still counts, so main
//     gets only human / feature commits; every reader (rewrites, bot, watchdog) reads the data branch.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { APP_EXCLUDES, isAppPath } from '../../supabase/functions/trader-coach/appPaths';

const ROOT = path.resolve(__dirname, '../..');
const SCRIPT = path.join(ROOT, 'scripts/vercel-ignore.sh');
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));

describe('vercel.json keeps the deployment budget setup', () => {
  it('fx / scanner / movers / insiders / holders JSON served live from the data branch on GitHub, not from the build', () => {
    for (const k of ['fx', 'scanner', 'movers', 'insiders', 'holders']) {
      expect(vercel.rewrites).toContainEqual({ source: `/${k}/(.*)\\.json`, destination: `https://raw.githubusercontent.com/r4m4nxd/ramanFX/data/public/${k}/$1.json` });
      expect(vercel.buildCommand).toMatch(new RegExp(`rm -rf [^&|;]*dist/${k}(\\s|$)`));
    }
    expect(vercel.buildCommand).toMatch(/^npm run build && rm -rf /);
  });
  it('ignored build step = the tested script; claude/* branches never deploy (only main does)', () => {
    expect(vercel.ignoreCommand).toBe('bash scripts/vercel-ignore.sh');
    expect(vercel.git.deploymentEnabled['claude/*']).toBe(false);
    expect(vercel.git.deploymentEnabled['audio/*']).toBe(false);
    expect(vercel.git.deploymentEnabled.main).not.toBe(false);
  });
  it('the data branch never deploys; no rewrite reads data from main', () => {
    expect(vercel.git.deploymentEnabled.data).toBe(false);
    for (const r of vercel.rewrites as { destination: string }[])
      if (r.destination.includes('githubusercontent')) expect(r.destination).toMatch(/\/ramanFX\/data\/public\//);
  });
  it('version.json: outside the SPA rewrite, never cached', () => {
    const spa = vercel.rewrites.find((r: { destination: string }) => r.destination === '/index.html');
    const re = new RegExp(`^${spa.source}$`);
    expect(re.test('/version.json')).toBe(false);
    expect(re.test('/fx/latest.json')).toBe(false);
    expect(re.test('/movers/latest.json')).toBe(false);
    expect(re.test('/insiders/latest.json')).toBe(false);
    expect(re.test('/holders/t/A.json')).toBe(false);
    expect(re.test('/holders/index.json')).toBe(false);
    expect(re.test('/scanner')).toBe(true);
    const h = vercel.headers.find((x: { source: string }) => x.source === '/version.json');
    expect(h.headers).toContainEqual({ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' });
  });
});

describe('app paths: the ignore script and the watchdog agree', () => {
  const script = fs.readFileSync(SCRIPT, 'utf8');
  it('same excludes in scripts/vercel-ignore.sh and appPaths.ts', () => {
    const plain = [...script.matchAll(/'\:\(exclude\)([^']+)'/g)].map(m => `${m[1]}/`);
    expect(plain.sort()).toEqual([...APP_EXCLUDES].sort());
    expect(script).toContain("':(glob,exclude)src/**/*.test.ts'");
    expect(script).toContain("':(glob,exclude)src/**/*.test.tsx'");
  });
  it('isAppPath', () => {
    for (const p of ['src/pages/Home.tsx', 'src/content/guide.ts', 'public/research/x.json', 'public/lessons/a.jpg', 'index.html', 'vercel.json', 'package.json', 'vite.config.ts', 'scripts/vercel-ignore.sh'])
      expect(isAppPath(p), p).toBe(true);
    for (const p of ['public/fx/latest.json', 'public/scanner/a.json', 'public/movers/latest.json', 'public/insiders/latest.json', 'public/holders/t/A.json', 'public/holders/index.json', 'public/fundamentals/fx.json', 'tools/briefing/state.json', 'supabase/functions/x/index.ts', '.github/workflows/a.yml', 'docs/a.md', 'qa/bars/XAUUSD/D1.json', 'src/core/a.test.ts', 'src/x.test.tsx'])
      expect(isAppPath(p), p).toBe(false);
  });
  // Every workflow that writes data: no `git push` / `git commit` to main (or to the checked-out branch) at all, only
  // scripts/data-branch.sh push with data paths; the only exception is the manual / research-code-triggered market
  // hours study (its results are bundled into the app, so they must be on main to deploy).
  const WF = path.join(ROOT, '.github/workflows');
  const workflows = fs.readdirSync(WF).filter(f => /\.ya?ml$/.test(f)).map(f => [f, fs.readFileSync(path.join(WF, f), 'utf8')] as const);
  const dataPaths = execFileSync('bash', [path.join(ROOT, 'scripts/data-branch.sh'), 'paths'], { encoding: 'utf8' }).trim().split('\n');
  const MAIN_OK = new Set(['market-hours.yml']);
  it('scheduled workflows never push to main: their data goes to the data branch', () => {
    const scheduled = workflows.filter(([, y]) => /^\s*schedule:/m.test(y));
    expect(scheduled.map(([f]) => f).sort()).toEqual(expect.arrayContaining(['briefing.yml', 'fundamentals.yml', 'fx-scan.yml', 'movers.yml', 'reminders.yml', 'stock-scan.yml']));
    for (const [f, y] of scheduled) {
      expect(y, `${f}: git push`).not.toMatch(/\bgit\s+(-\S+\s+)*push\b/);
      expect(y, `${f}: git commit`).not.toMatch(/\bgit\s+(-\S+\s+)*commit\b/);
      expect(y, `${f}: git add`).not.toMatch(/\bgit\s+add\b/);
      expect(y, `${f}: reads the data branch`).toMatch(/bash scripts\/data-branch\.sh pull/);
    }
  });
  it('every workflow that commits uses scripts/data-branch.sh push with data paths only (market hours: app files on main)', () => {
    let pushes = 0;
    for (const [f, y] of workflows) {
      if (!MAIN_OK.has(f)) expect(y, `${f}: git push`).not.toMatch(/\bgit\s+(-\S+\s+)*push\b/);
      for (const m of y.matchAll(/bash scripts\/data-branch\.sh push "[^"]*"((?:\s*\\\n)?[^\n|]*)/g)) {
        pushes++;
        const args = m[1].replace(/\\\n/g, ' ').trim().split(/\s+/).filter(a => a && a !== '--keep' && a !== '\\' && !a.startsWith('"$'));
        // "${paths[@]}": the paths=(...) arrays of the same step (backtest-publish.yml)
        if (m[1].includes('"${paths[@]}"')) for (const a of y.matchAll(/paths=\(([^)]*)\)/g)) args.push(...a[1].trim().split(/\s+/));
        expect(args.length, `${f}: ${m[0]}`).toBeGreaterThan(0);
        for (const a of args) expect(dataPaths.some(d => a === d || a.startsWith(`${d}/`)), `${f}: ${a} is not a data path`).toBe(true);
      }
    }
    expect(pushes).toBeGreaterThanOrEqual(8);
  });
  it('data paths never deploy, and readers use the data branch (bot, watchdog)', () => {
    for (const p of dataPaths) expect(isAppPath(p.includes('.') ? p : `${p}/`), p).toBe(false);
    const bot = fs.readFileSync(path.join(ROOT, 'supabase/functions/telegram-bot/index.ts'), 'utf8');
    expect(bot).toContain("const RAW_DATA = 'https://raw.githubusercontent.com/r4m4nxd/ramanFX/data/';");
    expect(bot).toMatch(/\$\{RAW_DATA\}public\/\$\{path\}`, `\$\{RAW\}public\/\$\{path\}`/);   // data first, main = fallback
    expect(bot).toContain('`${RAW_DATA}tools/reminders/events.json`');
    const health = fs.readFileSync(path.join(ROOT, 'supabase/functions/trader-coach/health.ts'), 'utf8');
    expect(health).not.toMatch(/raw\.githubusercontent\.com\/\$\{REPO\}\/main\//);
    expect(health).toContain('raw.githubusercontent.com/${REPO}/data/public');
  });
});

describe('scripts/vercel-ignore.sh (exit 0 = skip, 1 = build)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vign-'));
  afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }));
  const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t', VERCEL_GIT_PREVIOUS_SHA: '' };
  let n = 0;
  const git = (cwd: string, ...a: string[]) => execFileSync('git', a, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
  function repo() {
    const d = path.join(tmp, `r${++n}`);
    fs.mkdirSync(d);
    git(d, 'init', '-q', '-b', 'main');
    return d;
  }
  function commit(d: string, files: string[]) {
    for (const f of files) { fs.mkdirSync(path.dirname(path.join(d, f)), { recursive: true }); fs.writeFileSync(path.join(d, f), `${f} ${++n}\n`); }
    git(d, 'add', '-A');
    git(d, 'commit', '-q', '-m', `c${n}`);
    return git(d, 'rev-parse', 'HEAD');
  }
  const run = (d: string, prev = '') => spawnSync('bash', [SCRIPT], { cwd: d, env: { ...env, VERCEL_GIT_PREVIOUS_SHA: prev }, encoding: 'utf8' }).status;
  const base = (d: string) => commit(d, ['src/main.tsx', 'public/fx/latest.json', 'index.html']);

  it('data / bot / test-only commit -> skip; any app file -> build', () => {
    const d = repo(); base(d);
    commit(d, ['public/fx/latest.json', 'public/movers/latest.json', 'public/scanner/latest.json', 'public/fundamentals/fx.json']);
    expect(run(d)).toBe(0);
    commit(d, ['tools/briefing/state.json', 'supabase/functions/x/index.ts', '.github/workflows/a.yml', 'docs/r.md', 'src/core/a.test.ts', 'src/b.test.tsx']);
    expect(run(d)).toBe(0);
    for (const f of ['src/core/a.ts', 'public/research/x.json', 'public/lessons/a.jpg', 'vercel.json', 'package.json', 'index.html', 'scripts/vercel-ignore.sh']) {
      commit(d, [f]);
      expect(run(d), f).toBe(1);
    }
  });
  it('several commits in one push: compares with the last deployed commit (VERCEL_GIT_PREVIOUS_SHA), not just HEAD^', () => {
    const d = repo(); const deployed = base(d);
    commit(d, ['src/pages/Home.tsx']);
    commit(d, ['public/fx/latest.json']);
    expect(run(d)).toBe(0);              // HEAD^ alone would miss the app change...
    expect(run(d, deployed)).toBe(1);    // ...the last deploy does not
    const now = git(d, 'rev-parse', 'HEAD');
    commit(d, ['public/movers/latest.json']);
    expect(run(d, now)).toBe(0);
  });
  it('any doubt builds: first commit, unknown previous deploy, not a git repo', () => {
    const d = repo(); base(d);
    expect(run(d)).toBe(1);                          // no HEAD^
    commit(d, ['public/fx/latest.json']);
    expect(run(d, 'f'.repeat(40))).toBe(1);          // previous deploy not in the history
    const plain = path.join(tmp, 'plain'); fs.mkdirSync(plain);
    expect(run(plain)).toBe(1);
  });
  it('shallow clone (like Vercel): no HEAD^ -> build; deepens to reach the previous deploy', () => {
    const d = repo(); const deployed = base(d);
    for (let i = 0; i < 3; i++) commit(d, ['public/fx/latest.json']);
    const c = path.join(tmp, `clone${++n}`);
    git(tmp, 'clone', '-q', '--depth', '1', `file://${d}`, c);
    expect(run(c)).toBe(1);
    expect(run(c, deployed)).toBe(0);   // fetched deeper: only data since the deploy
    const c2 = path.join(tmp, `clone${++n}`);
    commit(d, ['src/app.ts']); commit(d, ['public/fx/latest.json']);
    git(tmp, 'clone', '-q', '--depth', '1', `file://${d}`, c2);
    expect(run(c2, deployed)).toBe(1);
  });
});
