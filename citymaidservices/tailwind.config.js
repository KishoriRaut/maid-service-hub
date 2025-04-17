/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#4F46E5',
          secondary: '#4338CA',
          light: '#EEF2FF',
        }
      }
    }
  },
  plugins: [],
} 