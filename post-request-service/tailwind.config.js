/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2D5D4F',
        accent: '#F5A623', 
        'bg-cream': '#F5E6D3',
        'card-cream': '#FDF8F0',
        'text-primary': '#333333',
        'text-interactive': '#2D5D4F',
      },
      fontFamily: {
        'cairo': ['Cairo', 'Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        naafe: {
          primary: '#2D5D4F',
          secondary: '#F5A623',
          accent: '#F5A623',
          neutral: '#333333',
          'base-100': '#FDF8F0',
          'base-200': '#F5E6D3',
          'base-300': '#E5D5C8',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
    ],
  },
};