/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#8b5cf6',
      },
      backgroundImage: {
        'subtle-gradient':
          'linear-gradient(135deg, rgba(30,64,175,0.06), rgba(139,92,246,0.06))',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.06)',
        glass: '0 4px 24px rgba(30, 64, 175, 0.12)',
      },
      borderRadius: {
        xl: '1rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
