/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: { globals: true, environment: 'jsdom' },
  build: {
    rollupOptions: {
      output: { manualChunks: { charts: ['recharts'], motion: ['framer-motion'], supabase: ['@supabase/supabase-js'] } },
    },
  },
});
