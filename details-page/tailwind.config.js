/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-teal': '#2D5D4F',
        'warm-cream': '#F5E6D3',
        'bright-orange': '#F5A623',
        'light-cream': '#FDF8F0',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        naafe: {
          primary: '#F5A623',
          secondary: '#2D5D4F',
          accent: '#F5A623',
          neutral: '#F5E6D3',
          'base-100': '#FDF8F0',
          'base-200': '#F5E6D3',
          'base-300': '#E5D4C1',
          info: '#2D5D4F',
          success: '#2D5D4F',
          warning: '#F5A623',
          error: '#ef4444',
        },
      },
    ],
  },
};