const path = require('path');
const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

// See https://github.com/gshigeto/ionic-environment-variables
module.exports = function () {
  useDefaultConfig.resolve.alias = {
    "@app/env": path.resolve(`./src/environments/environment${process.env.IONIC_ENV == 'prod' ? '' : '.' + process.env.IONIC_ENV}.ts`)
  };

  return useDefaultConfig;
};
