module.exports = function (config) {
    config.set({
        browsers: ['Chrome'],
        frameworks: ['mocha', 'sinon', 'chai'],
        files: ['index.js', 'index.test.js'],
    });
};
