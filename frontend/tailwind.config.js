/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          light: '#FF8C42',
        },
        secondary: {
          DEFAULT: '#F8F9FA',
        },
        dark: {
          DEFAULT: '#1A202C',
          muted: '#2D3748',
        },
        success: '#10B981',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
