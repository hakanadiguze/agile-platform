/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#edfaf5',
          100: '#d0f3e5',
          200: '#a4e7ce',
          300: '#6dd4b0',
          400: '#38bc92',
          500: '#1a9e78',   // ana renk - hakanadiguzel.com'daki teal
          600: '#127f61',
          700: '#0f664f',
          800: '#0d5241',
          900: '#0b4436',
        },
        ink: {
          50:  '#f4f4f0',
          100: '#e8e8e2',
          200: '#d0d0c8',
          300: '#adadA2',
          400: '#888880',
          500: '#666660',
          600: '#4d4d48',
          700: '#333330',
          800: '#1e1e1c',
          900: '#111110',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
