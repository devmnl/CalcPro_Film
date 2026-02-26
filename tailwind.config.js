/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF', // Modern iOS-like blue
        dark: '#000000',
        surface: '#1C1C1E', // Dark mode surface
      }
    },
  },
  plugins: [],
}
