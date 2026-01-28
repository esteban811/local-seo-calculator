/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'makarios': {
          'green': '#4FA941',
          'dark': '#224432',
          'lime': '#BAF915',
        }
      },
      fontFamily: {
        'sans': ['DM Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
