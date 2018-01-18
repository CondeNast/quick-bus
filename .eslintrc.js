module.exports = {
  plugins: ['compat'],
  env: {
    browser: true
  },
  rules: {
    'compat/compat': 'error'
  },
  globals: {
    Bus: true
  },
  overrides: [
    {
      env: {
        browser: true,
        mocha: true
      },
      files: [ 'index.test.js' ],
      globals: {
        Bus: true,
        sinon: false,
        describe: false,
        it: false,
        expect: false
      }
    }
  ]
};
