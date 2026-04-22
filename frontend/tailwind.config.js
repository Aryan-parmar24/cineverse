/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E50914',
        dark: '#141414',
        darkgray: '#1f1f1f',
        card: '#2a2a2a',
      },
      fontFamily: {
        netflix: ['Bebas Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}