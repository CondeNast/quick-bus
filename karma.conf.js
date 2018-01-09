module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'sinon', 'chai'],
    files: [
      'index.js',
      'index.test.js'
    ]
  });
};
