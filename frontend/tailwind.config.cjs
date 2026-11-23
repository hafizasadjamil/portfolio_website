module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // Journey colors come from the database, so Tailwind cannot find them in the code.
  safelist: [
    { pattern: /^(from|to)-(blue|cyan|indigo|purple|pink|orange|yellow|green|emerald|red|rose)-(400|500|600)$/ },
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0b1330',
        panel: '#131d42',
        line: '#2a3768',
        paper: '#eef1fb',
        muted: '#b1bbd9',
        accent: '#7ea6ff',
        action: '#2f62e6',
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
