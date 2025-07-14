/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'naafe-primary': '#2D5D4F',
        'naafe-accent': '#F5A623',
        'naafe-bg': '#F5E6D3',
        'naafe-card': '#FDF8F0',
      },
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        naafe: {
          primary: '#2D5D4F',
          secondary: '#F5E6D3',
          accent: '#F5A623',
          neutral: '#1A1A1A',
          'base-100': '#FDF8F0',
          'base-200': '#F5E6D3',
          'base-300': '#E8D5B8',
        },
      },
    ],
  },
};