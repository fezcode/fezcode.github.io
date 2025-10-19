const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('./src/config/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Mono', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: colors,
      typography: (theme) => ({
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.600'),
              },
            },

            h1: {
              color: theme('colors.markdown-hx-color'),
            },
            h2: {
              color: theme('colors.markdown-hx-color'),
            },
            h3: {
              color: theme('colors.markdown-hx-color'),
            },
            h4: {
              color: theme('colors.markdown-hx-color'),
            },
            h5: {
              color: theme('colors.markdown-hx-color'),
            },
            h6: {
              color: theme('colors.markdown-hx-color'),
            },

            strong: {
              color: theme('colors.gray.100'),
            },

            code: {
              color: theme('colors.gray.100'),
              fontFamily: theme('fontFamily.mono'),
            },

            figcaption: {
              color: theme('colors.gray.500'),
            },

            blockquote: {
              color: theme('colors.gray.400'),
              'border-left-color': theme('colors.primary.400'),
              quotes: '"" ""' ,
              lineHeight: '1.6',
            },

            li: {
              lineHeight: '1.6',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}