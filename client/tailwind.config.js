/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./src/**/*.{html,js}"],
  important: '#root',
  theme: {
    extend: {
      colors: {
        'chess-hover': '#21201d',
        'chess-dark': '#272522',
        'chess-default':'#312e2b',
        'chess-button': '#363432',
        'chess-placeholder':'#3d3b39',
        'chess-bar': '#939291',
        'chess-place-text':'#9e9d9c',
        'top-logo':'#fe2283',
        'mid-logo':"#fd6778",
        'bot-logo':'#feab7b'
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
      minHeight: {
        '1/2': '50%',
      }
    }

  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/line-clamp'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "animation-delay": (value) => {
            return {
              "animation-delay": value,
            };
          },
        },
        {
          values: theme("transitionDelay"),
        }
      );
    }),
  ],
}