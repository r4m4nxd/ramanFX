// Tailwind config for the sandbox page only (src/sandbox/index.html). sandbox.css pulls it in with @config and the
// app imports that file with ?inline, so Vite compiles it at build time: no generated CSS to keep in sync by hand.
// Colours are CSS variables: the app passes its own theme tokens (dark/light, accent) into the iframe.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const v = (n) => `rgb(var(--${n}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: [path.join(here, 'index.html')],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        bg: v('bg'), panel: v('surface'), panel2: v('raised'), line: v('line'), edge: v('line2'),
        ink: v('ink'), ink2: v('ink2'), ink3: v('ink3'),
        acc: v('accent'), buy: v('profit'), sell: v('loss'), gold: v('warn'), mentor: v('mentor'),
      },
      fontFamily: { sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'Inter', 'system-ui', 'sans-serif'] },
    },
  },
};
