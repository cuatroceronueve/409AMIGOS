/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"],
      },
      backgroundImage: (theme) => ({
        "wave-pattern-white": "url('../public/wave-white.png')",
        "yellow-dots": "url('../public/pattern-yellow-dots.png')",
        "svg-dots": "url('../public/icons8-music.svg')",
      }),
    },
  },
  plugins: [],
};
