/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sokdak: {
          bg: '#EDD2FF',
          primary: '#563176',
          button: '#ADD9FF',
          dark: '#1F333F',
        },
      },
      fontFamily: {
        sunshiney: ['Sunshiney', 'cursive'],
        mssans: ['"MS Sans Serif Bold"', 'sans-serif'],
      },
      boxShadow: {
        'retro-input': 'inset 4px 4px 0px 0px rgba(239, 215, 255, 1), inset -4px -4px 0px 0px rgba(242, 234, 248, 1), inset 2px 2px 0px 0px rgba(173, 117, 211, 1), inset -2px -2px 0px 0px rgba(255, 255, 255, 1)',
        'retro-button': 'inset 4px 4px 0px 0px rgba(223, 223, 223, 0.5), inset -4px -4px 0px 0px rgba(128, 128, 128, 0.5), inset 2px 2px 0px 0px rgba(255, 255, 255, 0.9), inset -2px -2px 0px 0px rgba(10, 10, 10, 0.9)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at 30% 30%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

