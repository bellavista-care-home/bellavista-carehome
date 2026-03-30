/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bellavista brand colors
        'brand-primary': '#0B1D51',
        'brand-secondary': '#1B45B8',
        'brand-accent': '#0F2A6E',
        'brand-dark': '#091744',
        'brand-light': '#f0f9ff',
      },
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
  // Prefix Tailwind classes to avoid conflicts with existing CSS
  prefix: 'tw-',
}
