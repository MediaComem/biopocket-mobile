// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global mocha */

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    '../e2e/**/*.spec.ts'
  ],
  capabilities: {
    browserName: 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:8100/',
  framework: 'mocha',
  MochaOpts: {
    reporter: 'spec',
    slow: 3000
  },
  useAllAngular2AppRoots: true,
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e'
    });
  }
};
