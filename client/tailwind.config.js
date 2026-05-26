/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        aurora: {
          cyan: '#63d3db',
          blue: '#4f8ef7',
          violet: '#a78bfa',
        },
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #63d3db 0%, #4f8ef7 50%, #a78bfa 100%)',
      },
    },
  },
  plugins: [],
}
