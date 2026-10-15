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
        'on-accent': v('on-accent'), 'on-status': v('on-status'),
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', '"SF Pro Display"', 'system-ui', 'sans-serif'],
        mono: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
      },
      // Semantic radius tokens (set per theme in index.css): one place to change the shape language.
      borderRadius: { md: 'var(--radius-xs)', lg: 'var(--radius-control)', xl: 'var(--radius-inner)', '2xl': 'var(--radius-card)', '3xl': 'var(--radius-panel)' },
      transitionDuration: { fast: 'var(--motion-fast)', base: 'var(--motion-base)', slow: 'var(--motion-slow)' },
      boxShadow: {
        card: 'var(--shadow-card)',
        glow: 'var(--glow)',
        pop: '0 12px 40px -8px rgb(0 0 0 / 0.5), 0 0 0 1px rgb(var(--line2))',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
      },
      animation: { shimmer: 'shimmer 1.4s linear infinite' },
    },
  },
  plugins: [
    // Custom media variants as plugins: object-style `screens` would disable Tailwind's max-* variants.
    // land = phone held sideways (short and wide); touch = coarse pointer.
    ({ addVariant }) => {
      addVariant('land', '@media (orientation: landscape) and (max-height: 520px)');
      addVariant('touch', '@media (pointer: coarse)');
    },
  ],
};
