var webpackConfig = require('./webpack.test.js');

// Force colors to be enabled in development, otherwise karma-spec-reporter
// outputs no colors when running through concurrently (with the "test:watch"
// npm script).
if (!process.env.TRAVIS) {
  require('colors').enabled = true;
}

module.exports = function(config) {
  config.set({
    basePath: '../',

    frameworks: [ 'mocha' ],

    files: [

      // Entry point for unit tests
      // (it requires all src/**/*.spec.ts test files)
      {
        pattern: './spec/karma-test-shim.js',
        watched: true
      },

      // Serve assets but do not watch for changes
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

    // Auto-compile TypeScript files with webpack and generate test coverage information
    preprocessors: {
      './spec/karma-test-shim.js': [ 'webpack', 'sourcemap', 'coverage' ]
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

    reporters: [
      // Display progress with the spec reporter
      'spec',
      // Generate test coverage reports with karma-coverage-istanbul-reporter
      // instead of the standard karma-coverage, otherwise the html and lcov
      // test coverage reports fail to be generated
      //
      // See https://github.com/webpack-contrib/istanbul-instrumenter-loader/issues/32
      'coverage-istanbul'
    ],

    // Generate test coverage reports
    coverageIstanbulReporter: {
      reports: [
        // Generate a coverage/index.html report
        'html',
        // Generate a coverage/lcov.info report to be sent to Coveralls
        'lcovonly',
        // Display a text summary in the console when running the tests
        'text-summary'
      ],
      dir: 'coverage/',
      fixWebpackSourcePaths: true
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [ 'Chrome' ],
    singleRun: false
  });
};
