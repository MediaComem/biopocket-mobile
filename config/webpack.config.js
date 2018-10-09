const defaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
const path = require('path');

// See https://github.com/gshigeto/ionic-environment-variables
module.exports = function() {

  const ionicEnv = process.env.IONIC_ENV || 'dev';
  const config = defaultConfig[ionicEnv];
  if (!config) {
    throw new Error(`No webpack config found for $IONIC_ENV "${ionicEnv}"`);
  }

  const environmentFileEnv = process.env.NODE_ENV || ionicEnv;
  console.log(`[${new Date().toLocaleTimeString()}]  WebPack building for environment '${environmentFileEnv}'`);
  config.resolve.alias = {
    "@app/env": path.resolve(`./src/environments/environment${environmentFileEnv == 'prod' ? '' : '.' + environmentFileEnv}.ts`),
    "@print": path.resolve('./src/utils/print.ts'),
    "@utils": path.resolve('./src/utils'),
    "@pages": path.resolve('./src/pages'),
    "@components": path.resolve('./src/components'),
    "@directives": path.resolve('./src/directives'),
    "@providers": path.resolve('./src/providers'),
    "@models": path.resolve('./src/models'),
    "@app": path.resolve('./src')
  };
  // So that webpack can resolve the aliases.
  // The length verification is there because, for an unknown reason, this function is executed several time,
  // each time pushing the path to the modules array.
  if (config.resolve.modules.length < 2) {
    config.resolve.modules.push(path.resolve(__dirname, '../src'));
  }

  return config;
};
