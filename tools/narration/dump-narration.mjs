// Dump Kevin's course narration (buildNarration) to JSON for offline TTS rendering (tools/narration/render.py).
// Run from the repo root: node tools/narration/dump-narration.mjs [lessonN|all] [outFile]
//   node tools/narration/dump-narration.mjs 1 tools/narration/out/kevin_01/narration.json
//   node tools/narration/dump-narration.mjs all tools/narration/out/kevin_all.json
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createServer } from 'vite';

const which = process.argv[2] ?? '1';
const out = process.argv[3] ?? `tools/narration/out/kevin_${String(which).padStart(2, '0')}/narration.json`;
const server = await createServer({ logLevel: 'warn', server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom' });
try {
  const { buildNarration } = await server.ssrLoadModule('/src/core/narration.ts');
  const { KEVIN_COURSE } = await server.ssrLoadModule('/src/core/mentors/kevin/index.ts');
  const lessons = which === 'all' ? KEVIN_COURSE : KEVIN_COURSE.filter(l => l.n === +which);
  if (!lessons.length) throw new Error(`no Kevin lesson ${which}`);
  const data = lessons.map(l => ({ n: l.n, title: l.title, chapters: buildNarration(l, 'Kevin') }));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(which === 'all' ? data : data[0], null, 2));
  const words = data.reduce((a, d) => a + d.chapters.reduce((b, c) => b + c.text.replace(/\[\[pause:\d+\]\]/g, ' ').split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`wrote ${out}: ${data.length} lesson(s), ${words} words`);
} finally { await server.close(); }
