/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        admin: {
          bg: '#faf8f5',
          surface: '#ffffff',
          surfaceMuted: '#f2efe9',
          border: '#e6e1d8',
          text: '#292520',
          muted: '#847c6f',
        },
        accent: {
          DEFAULT: '#b5542e',
          hover: '#9c4525',
          light: '#f4e3da',
        },
        danger: '#c1443a',
        success: '#4a8a6f',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
