/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-space': '#0a0f1a',
        'neon-purple': '#9333EA',
        'neon-blue': '#3B82F6',
        'neon-cyan': '#06B6D4',
        'neon-yellow': '#EAB308',
        'neon-gray': '#A0AEC0',
        'neon-white': '#F7FAFC',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(147, 51, 234, 0.5), 0 0 20px rgba(59, 130, 246, 0.5)',
        'neon-lg': '0 0 15px rgba(147, 51, 234, 0.7), 0 0 30px rgba(59, 130, 246, 0.7)',
      },
      textShadow: {
        'neon': '0 0 10px rgba(59, 130, 246, 0.7)',
      },
      backgroundImage: {
        'kuppi-gradient': 'linear-gradient(45deg, #9333EA, #3B82F6)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
      textDecorationColor: {
        'neon-purple': 'rgba(147, 51, 234, 0.5)',
        'neon-blue': 'rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const neonStyles = {
        '.underline-neon': {
          'text-decoration': 'underline',
          'text-decoration-thickness': '2px',
          'text-decoration-color': theme('textDecorationColor.neon-purple'),
          '@apply dark:text-decoration-color-[rgba(59,130,246,0.5)]': {}, // Use dark variant correctly
        },
      };
      addUtilities(neonStyles, ['hover', 'dark']);
    },
  ],
  darkMode: 'class',
};