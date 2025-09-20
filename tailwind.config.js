/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        accent: '#f5c518',
        surface: '#ffffff',
        ink: '#111827',
      },
      fontFamily: {
        sans: ['"SukhumvitSet-Medium"', ...fontFamily.sans],
        light: ['"SukhumvitSet-Light"', ...fontFamily.sans],
        medium: ['"SukhumvitSet-Medium"', ...fontFamily.sans],
        semibold: ['"SukhumvitSet-SemiBold"', ...fontFamily.sans],
        bold: ['"SukhumvitSet-Bold"', ...fontFamily.sans],
        extrabold: ['"SukhumvitSet-ExtraBold"', ...fontFamily.sans],
        display: ['"SukhumvitSet-SemiBold"', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
