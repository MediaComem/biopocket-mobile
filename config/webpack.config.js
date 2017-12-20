const defaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
const path = require('path');

// See https://github.com/gshigeto/ionic-environment-variables
module.exports = function () {

  const ionicEnv = process.env.IONIC_ENV || 'dev';
  const config = defaultConfig[ionicEnv];
  if (!config) {
    throw new Error(`No webpack config found for $IONIC_ENV "${ionicEnv}"`);
  }

  const environmentFileEnv = process.env.NODE_ENV || ionicEnv;
  config.resolve.alias = {
    "@app/env": path.resolve(`./src/environments/environment${environmentFileEnv == 'prod' ? '' : '.' + environmentFileEnv}.ts`)
  };

  return config;
};
