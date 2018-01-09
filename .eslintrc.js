module.exports = {
  parser: 'babel-eslint',
  extends: [
    '@condenast/eslint-config-condenast/teams/squad-goals'
  ],
  env: {
    browser: true,
    jasmine: true
  },
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'class-methods-use-this': 'error',
    'complexity': ['error', { 'max': 15 }],
    'no-prototype-builtins': 'error',
    'no-unused-vars': ['error', { 'vars': 'all', 'args': 'after-used', 'ignoreRestSiblings': false }],
    'prefer-spread': 'off',
    'valid-jsdoc': 'error',
    'import/extensions': 'off', // This seems to be errantly reporting issues at the moment
    'import/prefer-default-export': 'off', // Actually, we're using rollup
    'import/no-extraneous-dependencies': 'off' // window and document and such
  },
  'overrides': [
    {
      'files': [ '*.test.js' ],
      'rules': {
        'import/no-dynamic-require': 'off'
      }
    }
  ]
};
