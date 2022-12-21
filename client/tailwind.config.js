/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'chess-default':'#312e2b',
        'chess-dark':'#272522',
        'chess-bar':'#939291',
        'chess-text':'#ffffff',
        'chess-hover':'#21201d',
        'chess-placeholder':'#3d3b39',
        'chess-place-text':'#9e9d9c',
        'chess-button':'#363432'

      },
      aspectRatio: {
        '4/3': '4 / 3',
        '25/3': '25 / 3',
      },
      minHeight: {
        '1/2': '50%',
        '1/10': '10%',
      },
      backgroundImage: {
        'hero-pattern':
          "linear-gradient(to bottom, transparent,black), url('https://randomuser.me/api/portraits/women/70.jpg')",
        'card-hidden':
          "url('data: image / svg + xml,% 3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400' % 3E % 3Cdefs% 3E % 3CradialGradient id='a' cx='396' cy='281' r='514' gradientUnits='userSpaceOnUse' % 3E % 3Cstop offset='0' stop- color='%23D18'/%3E%3Cstop offset='1' stop-color='%23330000'/ % 3E % 3C/ radialGradient % 3E % 3ClinearGradient id = 'b' gradientUnits = 'userSpaceOnUse' x1 = '400' y1 = '148' x2 = '400' y2 = '333' % 3E % 3Cstop offset = '0' stop - color='%23FA3' stop - opacity='0' /% 3E % 3Cstop offset = '1' stop - color='%23FA3' stop - opacity='0.5' /% 3E % 3C / linearGradient % 3E % 3C / defs % 3E % 3Crect fill = 'url(%23a)' width = '800' height = '400' /% 3E % 3Cg fill - opacity='0.4' % 3E % 3Ccircle fill = 'url(%23b)' cx = '267.5' cy = '61' r = '300' /% 3E % 3Ccircle fill = 'url(%23b)' cx = '532.5' cy = '61' r = '300' /% 3E % 3Ccircle fill = 'url(%23b)' cx = '400' cy = '30' r = '300' /% 3E % 3C / g % 3E % 3C / svg % 3E')",
      },
      keyframes: {
        wiggle: {
        "0%, 100%": { transform: "rotate(-10deg)" },
        "50%": { transform: "rotate(10deg)" },
               },

        slideOutRight: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(25%)" },
        },

        slideOutRightOut: {
          "0%": { transform: "translateY(25%)" },
          "100%": { transform: "translateY(0)" },
        },
      },

      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        slideOutRightIn: "slideOutRight 1s ease-in-out forwards",
        slideOutRightOut: "slideOutRightOut 1s ease-in-out forwards",
      },
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