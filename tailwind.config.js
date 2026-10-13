/** @type {import('tailwindcss').Config} */
const v = (n) => `rgb(var(--${n}) / <alpha-value>)`;
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'), surface: v('surface'), raised: v('raised'), line: v('line'), line2: v('line2'),
        ink: v('ink'), ink2: v('ink2'), ink3: v('ink3'),
        accent: v('accent'), profit: v('profit'), loss: v('loss'), warn: v('warn'), violet: v('violet'), cyan: v('cyan'),
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { xl: '14px', '2xl': '18px' },
      boxShadow: {
        card: '0 1px 0 rgb(255 255 255 / 0.03) inset, 0 1px 2px rgb(0 0 0 / 0.2)',
        pop: '0 12px 40px -8px rgb(0 0 0 / 0.5), 0 0 0 1px rgb(var(--line2))',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
      },
      animation: { shimmer: 'shimmer 1.4s linear infinite' },
    },
  },
  plugins: [],
};
