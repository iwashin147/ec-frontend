import nextPlugin from '@next/eslint-plugin-next';
import prettierPlugin from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: ['.next/'],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,mts,tsx,mtsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  prettierPlugin,
];

export default config;
