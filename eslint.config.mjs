import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'keyword-spacing': [
        'error',
        {
          before: true,
          after: true,
          overrides: {
            if: { before: true, after: true },
            return: { before: true, after: true },
            else: { before: true, after: true },
            while: { before: true, after: true },
            for: { before: true, after: true },
            switch: { before: true, after: true },
            catch: { before: true, after: true },
          },
        },
      ],
      'space-before-blocks': ['error', 'always'],
      'block-spacing': ['error', 'always'],
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astro.parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],
      },
    },
    plugins: {
      astro,
    },
    rules: {
      ...astro.configs.recommended.rules,
    },
  },
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**'],
  },
];
