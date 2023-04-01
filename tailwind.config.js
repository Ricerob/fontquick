const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'pastel-50': '#f5fbf7',
        'pastel-100': '#d8f0dd',
        'pastel-200': '#b2d8bb',
        'pastel-300': '#8ac19a',
        'pastel-400': '#5da978',
        'pastel-500': '#328957',
        'pastel-600': '#2d7e4f',
        'pastel-700': '#25653d',
        'pastel-800': '#1d4c2b',
        'pastel-900': '#153219',
      },
      fontFamily: {
        "Alegreya": ["Alegreya Sans", ...defaultTheme.fontFamily.sans],
        "Orbitron": ["Orbitron", ...defaultTheme.fontFamily.sans],
        "Cedarville": ["Cedarville Cursive", ...defaultTheme.fontFamily.sans],
        "VT323": ["VT323", ...defaultTheme.fontFamily.sans],
        "Rubik": ["Rubik Moonrocks", ...defaultTheme.fontFamily.sans],
        "EB": ["EB Garamond", ...defaultTheme.fontFamily.sans],
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
