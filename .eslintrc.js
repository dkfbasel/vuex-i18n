// configuration for eslint
module.exports = {
  // this is the root node
  root: true,
  env: {
    // use node as environment
    node: true,
  },
  extends: [
    // add some plugins for vue and typescript, airbnb for the syntax
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  // modify some of the rules that come with the plugins
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
  // use the typescript-eslint parser
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  // override some rules in specific files
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
