/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0B0F19',       // Premium very dark slate background
          card: '#151C2C',     // Dark blue-grey card background
          accent: '#E50914',   // Crimson red for buttons/indicators
          hover: '#B80710',    // Darker red for hover
          gold: '#FFC107',     // Premium seat/badge color
          silver: '#9E9E9E',   // Silver seat/badge color
          bronze: '#CD7F32',   // Bronze seat/badge color
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
