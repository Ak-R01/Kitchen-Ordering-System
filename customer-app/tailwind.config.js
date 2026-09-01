/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        menu: {
          bg: '#fdf6ee',
          surface: '#ffffff',
          surfaceMuted: '#f6ede0',
          border: '#ece1d0',
          text: '#2b2420',
          muted: '#8c8175',
        },
        accent: {
          DEFAULT: '#c1502e',
          hover: '#a63f22',
          light: '#f7ded4',
        },
        success: '#4a8a6f',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
