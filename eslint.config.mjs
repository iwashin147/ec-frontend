import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import perfectionistPlugin from 'eslint-plugin-perfectionist';

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
    rules: {
      'no-restricted-imports': [
        'error',
        {
          name: 'next/link',
          importNames: ['Link'],
          message:
            '衝突を避けるため、\'import { Link as NextLink } from from "next/link"\' を使用してください。',
        },
        {
          name: '@mui/material',
          importNames: ['Link'],
          message:
            '衝突を避けるため、\'import { Link as MuiLink } from "@mui/material"\' を使用してください。',
        },
      ],
    },
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
  {
    plugins: { perfectionist: perfectionistPlugin },
    rules: {
      'perfectionist/sort-interfaces': 'warn',
      'perfectionist/sort-object-types': 'warn',
    },
  },
  eslintConfigPrettier,
];

export default eslintConfig;
