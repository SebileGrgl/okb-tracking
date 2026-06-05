/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#edf7f4',
          100: '#c8eae2',
          200: '#91d4c5',
          300: '#5abfa8',
          400: '#2ea98c',
          500: '#218c74',
          600: '#1a7060',
          700: '#14554a',
          800: '#0d3a33',
          900: '#071e1a',
        },
        surface: {
          DEFAULT:   '#ffffff',
          secondary: '#f7faf8',
          tertiary:  '#eef3f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        btn:  '10px',
        chip: '999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        nav:  '0 -1px 0 rgba(0,0,0,0.06)',
        xl:   '0 8px 30px rgba(0,0,0,0.08)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}
