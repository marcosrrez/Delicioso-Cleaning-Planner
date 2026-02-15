/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-cream': '#FFFDF5',
        'brand-pink': '#FFD3E2',
        'brand-blue': '#D0EBFF',
        'brand-green': '#D3F9D8',
        'brand-yellow': '#FFD8A8',
        'brand-purple': '#EEBFFB',
        'brand-accent': '#FF922B',
      },
      borderRadius: {
        'xl-plus': '24px',
        '2xl-plus': '32px',
      },
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
