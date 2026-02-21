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
        'brand-primary': '#1b3c78',
        'brand-secondary': '#2563eb',
        'brand-accent': '#0891b2',
        'brand-dark': '#0d2650',
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
