/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-teal': '#2D5D4F',
        'bright-orange': '#F5A623',
        'warm-cream': '#F5E6D3',
        'light-cream': '#FDF8F0',
        'text-primary': '#0E1B18',
        'text-secondary': '#50958A',
      },
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
        'plus-jakarta': ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};