/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        'claris-gold': '#D4AF37',
        'claris-gold-dark': '#B8941F',
        'claris-gray': '#6c757d',
        'claris-gray-light': '#f8f9fa',
      },
    },
  },
  plugins: [],
}