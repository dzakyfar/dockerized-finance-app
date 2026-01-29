const globals = require('globals');
const pluginJs = require('@eslint/js');
const configPrettier = require('eslint-config-prettier');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },

  pluginJs.configs.recommended,

  configPrettier,

  {
    rules: {
      semi: 'error',
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-process-exit': 'off',
      'prefer-const': 'warn',
    },
  },
];
