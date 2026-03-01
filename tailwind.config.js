/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#45009D',
          'purple-light': '#6B21E8',
          yellow: '#F7F590',
          dark: '#0A0019',
          light: '#F5F0FF',
          mid: '#EDE7FF',
          muted: '#D0C8E8',
        },
        cycle: {
          menstrual: '#EF9A9A',
          follicular: '#A5D6A7',
          ovulatory: '#FFF176',
          luteal: '#FFCC80',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
