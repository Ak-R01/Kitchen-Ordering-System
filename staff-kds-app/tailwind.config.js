/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        kitchen: {
          bg: '#15171c',
          surface: '#1f232b',
          surfaceHover: '#282d37',
          border: '#2e333d',
          text: '#e8eaed',
          muted: '#8a909c',
        },
        fresh: '#3fb6a8',   // just placed, calm
        warn: '#e8a13d',    // getting old, pay attention
        urgent: '#e2513f',  // too old, act now
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
