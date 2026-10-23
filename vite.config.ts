/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
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
