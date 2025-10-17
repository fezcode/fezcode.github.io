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
          400: '#f87171', // red-400
          500: '#ef4444', // red-500
          600: '#dc2626', // red-600
        },
        secondary: {
          400: '#fb923c', // orange-400
        },
        book: '#3b82f6', // blue-500
        movie: '#ef4444', // red-500
        game: '#22c55e', // green-500
        article: '#f97316', // orange-500
        music: '#a855f7', // purple-500
        series: '#ec4899', // pink-500
        'title-hover': '#fdd4a6', // orange-200
        'markdown-title-color': '#fed7aa', // orange-200
        'markdown-hx-color': '#ffedd5', // orange-100
        'dev-card-bg': 'rgba(68, 64, 59, 0.3)', // stone-700
        'dev-card-bg-hover': 'rgba(68, 64, 59, 0.55)', // stone-700/20
        'takes-card-bg': 'rgba(6, 95, 70, 0.175)', // emerald-900/15
        'takes-card-bg-hover': 'rgba(16, 185, 129, 0.275)', // emerald-500/20
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