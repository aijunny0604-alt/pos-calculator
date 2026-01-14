/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',  // 작은 폰 (iPhone SE, Galaxy S 등)
      },
    },
  },
  plugins: [],
}
