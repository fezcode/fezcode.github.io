const defaultTheme = require('tailwindcss/defaultTheme')

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
      colors: {
        primary: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        secondary: {
          400: '#fb923c',
        },
        book: '#3b82f6',
        movie: '#ef4444',
        game: '#22c55e',
        article: '#f97316',
        music: '#a855f7',
        series: '#ec4899',
        'title-hover': '#fdd4a6',
        'dev-card-bg': 'rgba(68, 64, 60, 0.1)',
        'takes-card-bg': 'rgba(6, 95, 70, 0.15)',
      },
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
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
            h3: {
              color: theme('colors.gray.100'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },
            h5: {
              color: theme('colors.gray.100'),
            },
            h6: {
              color: theme('colors.gray.100'),
            },

            strong: {
              color: theme('colors.gray.100'),
            },

            code: {
              color: theme('colors.gray.100'),
            },

            figcaption: {
              color: theme('colors.gray.500'),
            },

            blockquote: {
              color: theme('colors.gray.400'),
              'border-left-color': theme('colors.primary.400'),
              quotes: '"" ""' ,
              lineHeight: '1',
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