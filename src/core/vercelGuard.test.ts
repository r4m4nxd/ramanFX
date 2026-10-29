// @vitest-environment node
// Vercel Hobby allows 100 deployments a day. These guards keep the setup that keeps us far below it:
//   - vercel.json: data served live from GitHub (rewrites), data folders out of dist/, the ignore script, no preview
//     deployments of the claude/* working branches, version.json for the health watchdog;
//   - scripts/vercel-ignore.sh: exit 0 (skip) ONLY when nothing app-affecting changed since the last deploy; tested on
//     real temp git repos incl. shallow clones;
//   - the scheduled workflows commit only paths that never deploy.
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
  it('fx / scanner / movers / insiders JSON served live from GitHub, not from the build', () => {
    const BRANCH: Record<string, string> = { insiders: 'data' };   // the insiders job commits to the data branch only
    for (const k of ['fx', 'scanner', 'movers', 'insiders']) {
      expect(vercel.rewrites).toContainEqual({ source: `/${k}/(.*)\\.json`, destination: `https://raw.githubusercontent.com/r4m4nxd/ramanFX/${BRANCH[k] ?? 'main'}/public/${k}/$1.json` });
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
  it('version.json: outside the SPA rewrite, never cached', () => {
    const spa = vercel.rewrites.find((r: { destination: string }) => r.destination === '/index.html');
    const re = new RegExp(`^${spa.source}$`);
    expect(re.test('/version.json')).toBe(false);
    expect(re.test('/fx/latest.json')).toBe(false);
    expect(re.test('/movers/latest.json')).toBe(false);
    expect(re.test('/insiders/latest.json')).toBe(false);
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
    for (const p of ['public/fx/latest.json', 'public/scanner/a.json', 'public/movers/latest.json', 'public/insiders/latest.json', 'public/fundamentals/fx.json', 'tools/briefing/state.json', 'supabase/functions/x/index.ts', '.github/workflows/a.yml', 'docs/a.md', 'src/core/a.test.ts', 'src/x.test.tsx'])
      expect(isAppPath(p), p).toBe(false);
  });
  it('scheduled workflows commit only paths that never deploy', () => {
    const dir = path.join(ROOT, '.github/workflows');
    for (const f of fs.readdirSync(dir)) {
      const y = fs.readFileSync(path.join(dir, f), 'utf8');
      if (!/^\s*schedule:/m.test(y)) continue;
      const adds = [...y.matchAll(/git add ([^\n|&;]+)/g)].flatMap(m => m[1].replace(/\\$/, '').trim().split(/\s+/)).filter(p => p && !p.startsWith('-') && !p.startsWith('2>'));
      for (const p of adds) expect(isAppPath(p.replace(/\/?$/, p.includes('.') ? '' : '/')), `${f}: git add ${p}`).toBe(false);
    }
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
