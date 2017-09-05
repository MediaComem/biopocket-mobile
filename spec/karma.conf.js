var webpackConfig = require('./webpack.test.js');

// Force colors to be enabled in development, otherwise karma-spec-reporter
// outputs no colors when running through concurrently (with the "test:watch"
// npm script).
if (!process.env.TRAVIS) {
  require('colors').enabled = true;
}

module.exports = function(config) {
  var _config = {
    basePath: '../',

    frameworks: [ 'mocha' ],

    files: [
      {
        pattern: './spec/karma-test-shim.js',
        watched: true
      },
      {
        pattern: './src/assets/**/*',
        watched: false,
        included: false,
        served: true,
        nocache: false
      }
    ],

    proxies: {
      '/assets/': '/base/src/assets/'
    },

    preprocessors: {
      './spec/karma-test-shim.js': [ 'webpack', 'sourcemap' ]
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },

    reporters: [ 'spec' ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  };

  config.set(_config);
};
