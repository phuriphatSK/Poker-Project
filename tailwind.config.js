/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        'bai': ['BaiJamjuree', 'sans-serif'],
        'mali': ['Mali', 'sans-serif'],
      },
      colors: {
        'Custom-Purple': '#5B3F8C',   
    },
  },
  plugins: [],
},
};

