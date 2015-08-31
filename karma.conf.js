module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'mocha'],
    files: ['spec/**/*Spec.js'],
    exclude: [],
    preprocessors: {
      'spec/**/*.js': ['browserify']
    },
    browserify: {
      transform: ['babelify'],
      watch: true
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
