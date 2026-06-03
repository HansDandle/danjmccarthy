/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        'xp-blue': '#0831d9',
        'xp-blue-light': '#1a6fe8',
        'xp-taskbar': '#245edb',
        'xp-start': '#3e9a1f',
        'xp-win-active': '#0058e6',
        'xp-win-inactive': '#7a96df',
      },
      fontFamily: {
        tahoma: ['Tahoma', 'MS Sans Serif', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
