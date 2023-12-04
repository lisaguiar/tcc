/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js, jsx, ts, tsx}"
  ],
  theme: {
    extend: {
      height: {
        'header': 'var(--header-height)'
      },
      width: {
        'sidebar': 'var(--sidebar-width)',
        'searchbar': 'var(--searchbar-width)',
        'board': 'calc(var(--board-width) - 0.5em)',
        'slick-card': '90%',
        'card-4': '22%'
      },
      spacing: {
        'searchbar': 'calc(var(--searchbar-width) + 0.5em)'
      },
      padding: {
        'header-top': 'var(--header-height) 0 var(--header-height) 0'
      },
      colors: {
        'glass': 'rgba(255, 255, 255, 0.8)',
        'dark-grey': 'var(--dark-grey)',
        'light-purple': 'var(--light-purple)',
        'purple': 'var(--purple)',
        'light-grey': 'var(--light-grey)',
        'dark-purple': 'var(--dark-purple)',
        'grey-blue': 'var(--grey-blue)',
        'light': 'var(--light)'
      },
      textColor: {
        'alert': 'var(--text-alert)',
        'list': 'var(--text-list)'
      },
    },
  },
  plugins: [],
}

