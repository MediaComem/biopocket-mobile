var webpack = require('webpack');
var path = require('path');

module.exports = {

  // Generate source maps so that code coverage reports
  // can point to the original source
  devtool: 'inline-source-map',

  resolve: {
    extensions: [ '.ts', '.js' ],
    alias: {
      "@app/env": path.resolve('./src/environments/environment.test.ts'),
      "@print": path.resolve('./src/utils/print.ts'),
      "@spec": path.resolve('./spec'),
      "@utils": path.resolve('./src/utils'),
      "@pages": path.resolve('./src/pages'),
      "@components": path.resolve('./src/components'),
      "@classes": path.resolve('./src/classes'),
      "@providers": path.resolve('./src/providers'),
      "@models": path.resolve('./src/models'),
      "@app": path.resolve('./src')
    },
    modules: [ path.resolve('./node_modules'), path.resolve('./src') ]
  },

  module: {
    rules: [

      // Compile source .ts files (excluding test files)
      // and instrument them for code coverage
      {
        test: {
          include: /\.ts$/,
          exclude: [ /spec\//, /\.spec\.ts$/ ]
        },
        loaders: [
          {
            loader: 'istanbul-instrumenter-loader',
            query: {
              esModules: true
            }
          },
          {
            loader: 'ts-loader'
          },
          'angular2-template-loader'
        ]
      },

      // Compile .spec.ts files and .ts files in the spec directory
      // (but do not instrument them as coverage is not needed)
      {
        test: {
          include: [ /spec\/.+.ts$/, /\.spec\.ts$/ ]
        },
        loaders: [
          {
            loader: 'ts-loader'
          }
        ]
      },

      // Process HTML without requiring assets
      // (see https://www.npmjs.com/package/html-loader)
      {
        test: /\.html$/,
        loader: 'html-loader?attrs=false'
      },

      // Do not process assets
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'null-loader'
      }
    ]
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /(ionic-angular)|(angular(\\|\/)core(\\|\/)@angular)/,
      root('./src'), // location of your src
      {} // a map of your routes
    )
  ]
};

function root(localPath) {
  return path.resolve(__dirname, localPath);
}
