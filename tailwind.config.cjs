/** @type {import('tailwindcss').Config} */

module.exports = {
  //content: ['./src/**/*.{html,js,svelte,ts}',
  //  "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'mc-blue': 'rgb(var(--color-mc-blue) / 97)',
        'mc-orange': 'rgb(var(--color-mc-orange) / 100)',
        'mc-gray': 'rgb(var(--color-mc-gray) / 100)',
      },
      fontFamily: {
        sans: ['Barlow Semi Condensed', 'sans-serif'],
      },
    }
  },
  plugins: [
    // require('flowbite/plugin')
  ],
  darkMode: 'class',
};
