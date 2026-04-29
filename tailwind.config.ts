/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'neon': {
          blue: '#00f3ff',
          purple: '#9d00ff',
          pink: '#ff00ff',
        }
      }
    },
  },
  plugins: [],
}
