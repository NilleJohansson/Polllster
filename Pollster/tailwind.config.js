/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'brand-blue': '#111827'
      },
      colors: {
        'grey-sub-color': '#606675',
        'grey-sub-color-hover': '#767b87'
      } 
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}

