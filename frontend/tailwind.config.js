export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#0f172a',
          100: '#111827',
          200: '#1f2937',
          300: '#374151',
          400: '#4b5563',
        },
        accent: {
          400: '#14b8a6',
          500: '#0d9488',
          600: '#0f766e',
        }
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(135deg, #0f172a 0%, #111827 100%)',
      }
    },
  },
  plugins: [],
}
