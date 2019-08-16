module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prefer-destructuring': 'off',
    'no-prototype-builtins': 'off',
    'no-use-before-define': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'prefer-rest-params': 'off',
    'no-continue': 'off',
    'import/prefer-default-export': 'off',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  overrides: [
    {
      files: ['src/store/vuex-i18n-plurals.ts'],
      rules: {
        'no-nested-ternary': 'off',
        'max-len': 'off',
      },
    }, {
      files: ['src/store/vuex-i18n-mutations.ts'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
  ],
};
