/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import type { Plugin } from 'vite';

// Byte size of every downloadable tool, read at build time for the /tools page.
const toolsDir = path.resolve(__dirname, 'public/tools');
const toolSizes = Object.fromEntries((fs.existsSync(toolsDir) ? fs.readdirSync(toolsDir) : []).map(f => [f, fs.statSync(path.join(toolsDir, f)).size]));

// dist/version.json: which commit this build is ({ sha, built_at }); the trader coach's health watchdog compares it with
// main to notice when Vercel stops deploying (health.ts 'app'). Served no-cache, outside the SPA rewrite (vercel.json).
function versionStamp(): Plugin {
  const gitSha = () => { try { return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return ''; } };
  return {
    name: 'version-stamp',
    apply: 'build',
    generateBundle() {
      const sha = process.env.VERCEL_GIT_COMMIT_SHA || gitSha() || null;
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ sha, built_at: new Date().toISOString() }) + '\n' });
    },
  };
}

export default defineConfig({
  plugins: [react(), versionStamp()],
  define: { __TOOL_SIZES__: JSON.stringify(toolSizes) },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // ONNX Runtime Web's .wasm for the Kokoro narrator worker, served from our origin instead of a CDN.
      '@ort': path.resolve(__dirname, 'node_modules/onnxruntime-web/dist'),
    },
  },
  // The Kokoro worker code-splits (kokoro-js is imported on demand), which needs ES-module workers.
  worker: { format: 'es' },
  test: { globals: true, environment: 'jsdom' },
  build: {
    rollupOptions: {
      output: { manualChunks: { charts: ['recharts'], motion: ['framer-motion'], supabase: ['@supabase/supabase-js'] } },
    },
  },
});
