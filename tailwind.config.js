module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        text: 'var(--text)',
        background: 'var(--background)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
      },
      backgroundColor: {
        DEFAULT: 'var(--background)',
      },
      textColor: {
        DEFAULT: 'var(--text)',
      },
    },
  },
  plugins: [],
};
