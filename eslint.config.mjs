import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
// import tailwindcss from 'eslint-plugin-tailwindcss';
// NOTE: eslint-plugin-tailwindcss disabled until it supports Tailwind v4 CSS-first config
// https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/272
import stylistic from '@stylistic/eslint-plugin';
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
            // tailwindcss,
            '@stylistic': stylistic,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,

            // Tailwind CSS validation (disabled - plugin doesn't support v4 CSS-first config yet)
            // ...tailwindcss.configs['flat/recommended'].rules,
            // 'tailwindcss/classnames-order': 'off',
            // 'tailwindcss/no-contradicting-classname': 'error',
            // 'tailwindcss/enforces-shorthand': 'warn',

            // Blank line before block statements
            '@stylistic/padding-line-between-statements': [
                'error',
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'return',
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'if',
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'for',
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'while',
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'switch',
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'try',
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'do',
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'function',
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'block-like',
                },
                // Allow consecutive block statements without extra blank lines
                {
                    blankLine: 'any',
                    prev: [
                        'if',
                        'for',
                        'while',
                        'switch',
                        'try',
                        'function',
                        'do',
                        'block-like',
                    ],
                    next: '*',
                },
            ],

            // Space before/after keywords
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
            // tailwindcss,
            '@stylistic': stylistic,
        },
        rules: {
            ...astro.configs.recommended.rules,
            // 'tailwindcss/classnames-order': 'off',
            // 'tailwindcss/no-contradicting-classname': 'error',
            // 'tailwindcss/enforces-shorthand': 'warn',
        },
    },
    {
        ignores: ['dist/**', '.astro/**', 'node_modules/**'],
    },
];
