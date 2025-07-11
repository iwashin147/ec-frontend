import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';
import prettierPlugin from 'eslint-plugin-prettier';
import pluginQuery from '@tanstack/eslint-plugin-query';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      '.next/',
      'node_modules/',
      'dist/',
      'build/',
      'prettier.config.js',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    name: 'next/core-web-vitals',
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  ...compat.extends('next/typescript'),
  ...pluginQuery.configs['flat/recommended'],
  {
    plugins: { perfectionist: perfectionistPlugin },
    rules: {
      'perfectionist/sort-interfaces': 'warn',
      'perfectionist/sort-object-types': 'warn',
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,html}'],
    plugins: {
      tailwindcss: tailwindcssPlugin,
    },
    rules: {
      ...tailwindcssPlugin.configs.recommended.rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,json,html,css,scss,md}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'error',
    },
  },
];

export default eslintConfig;
