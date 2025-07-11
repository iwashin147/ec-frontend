/** @type {import("prettier").Config} */
const config = {
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  printWidth: 80,
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
