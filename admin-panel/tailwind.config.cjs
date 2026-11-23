module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // Journey colors come from the database, so Tailwind cannot find them in the code.
  safelist: [
    { pattern: /^(from|to)-(blue|cyan|indigo|purple|pink|orange|yellow|green|emerald|red|rose)-(400|500|600)$/ },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
