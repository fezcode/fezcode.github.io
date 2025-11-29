const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('./src/config/colors');
const fonts = require('./src/config/fonts'); // New import

/** @type {import('tailwindcss').Config} */
/**
 * fezcode: important
 * tailwind.config.js affects colors through the @tailwindcss/typography plugin, which styles markdown-generated HTML. Specifically, the typography
 *   extension in tailwind.config.js allows customizing these styles. Our recent change modified the code element's color within the dark typography variant
 *   to primary.400 (red).
 *
 * This change resolved a conflict where tailwind.config.js's prose-dark styles were overriding react-syntax-highlighter's customTheme.js base color for
 *   the <code> element due to CSS specificity. By setting the code color directly in tailwind.config.js to red, we ensured the dominant styling rule for
 *   the code block's base text color was the desired red, while customTheme.js still colors individual <span> tokens (comments, keywords) with more
 *   specific rules.
 */
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
        arvo: fonts.arvo, // New custom font
        playfairDisplay: fonts.playfairDisplay, // New custom font
        inter: fonts.inter, // New custom font
      },
      colors: colors,
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'blockquote p:first-of-type::before': {
              content: 'none',
            },
            'blockquote p:last-of-type::after': {
              content: 'none',
            },
          },
        },
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

            th: {
              color: theme('colors.gray.100'),
            },

            strong: {
              color: theme('colors.gray.100'),
            },

            code: {
              color: theme('colors.primary.400'), // fezcode: important default text color for codeblocks
              fontFamily: theme('fontFamily.mono'),
            },

            figcaption: {
              color: theme('colors.gray.500'),
            },

            blockquote: {
              color: theme('colors.gray.400'),
              'border-left-color': theme('colors.primary.400'),
              lineHeight: '1.6',
            },
            'blockquote p:first-of-type::before': {
              content: 'none',
            },
            'blockquote p:last-of-type::after': {
              content: 'none',
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
