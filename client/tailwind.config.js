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
      padding: {
        'header-top': 'var(--header-height) 0 0 0'
      },
      backgroundColor: {
        skin: {
          lp: 'var(--light-purple)',
        }
      },
      colors: {
        'glass': 'rgba(255, 255, 255, 0.6)',
        'glass-dark': 'rgba(31, 41, 55, 0.7)',
      },
      textColor: {
        'alert': 'var(--text-alert)',
        'list': 'var(--text-list)'
      }
    },
  },
  plugins: [],
}

