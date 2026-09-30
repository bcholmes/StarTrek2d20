const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');

module.exports = [
  {
    files: ['src/**/*.{js,jsx,ts,tsx}', 'tests/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'unicode-bom': 'off',
      semi: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
];
