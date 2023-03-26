require('@rushstack/eslint-patch/modern-module-resolution')
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  globals: {},
  extends: [
    'plugin:jsonc/recommended-with-jsonc',
    'plugin:markdown/recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    'airbnb-base',
    '@vue/eslint-config-prettier'
  ],
  plugins: ['html'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  overrides: [
    {
      files: ['*.json', '*.json5', '*.jsonc'],
      parser: 'jsonc-eslint-parser'
    }
  ],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'comma-dangle': 'off',
    'vue/multi-word-component-names': ['error', { ignores: ['index'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'import/newline-after-import': 'off',
    'import/no-absolute-path': 'off', // For import ./public.
    'import/no-unresolved': 'off',
    'no-unused-vars': 'off', // Use @typescript-eslint/no-unused-vars to check.
    'no-shadow': 'off', // Use @typescript-eslint/no-shadow to check.
    'no-undef': 'off', // TypeScript already checked it.
    '@typescript-eslint/no-shadow': 'error'
  }
})
