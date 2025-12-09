/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f7f9ff',
          100: '#eef2ff',
          500: '#3b82f6',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
