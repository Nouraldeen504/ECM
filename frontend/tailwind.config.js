// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B365D',
        secondary: '#008B8B',
        accent: '#FF7F50',
      },
    },
  },
  plugins: [],
}