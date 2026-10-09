import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
    './resources/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        cream:   '#FBF7F2',
        peach:   '#F9D5C5',
        mint:    '#CFE8DC',
        lavender:'#DCD3F0',
        butter:  '#F8EBB8',
        sky:     '#CFE3F3',
        ink:     '#2B2A33',
        'ink-soft': '#5B5963',
      },
      fontFamily: {
        display: ['Fraunces', ...defaultTheme.fontFamily.serif],
        sans:    ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
    },
  },
  plugins: [forms, typography],
};
