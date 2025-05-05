/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors for Islamic/Quranic themes
        'quran-gold': '#D4AF37',
        'quran-green': '#00733C',
        'quran-blue': '#044C7F',
        'quran-black': '#1A1A1A',
        'quran-paper': '#F8F5E9',
      },
      fontFamily: {
        // Add fallback fonts for Arabic text
        'arabic': ['KFGQPC Uthmanic Script HAFS', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        // Special shadow for Quranic text elements
        'quran-card': '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        // Special spacing for Arabic text elements
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        // Special border radius for Quranic decoration
        'quran': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}