module.exports = {
  devServer: {
    proxy: {
      '/api/show-my-ip': {
        target: 'https://api.ipify.org',
        changeOrigin: true,
        pathRewrite: { '^/api/show-my-ip': '' },
      },
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.use((req, res, next) => {
        if (req.path.endsWith('.piml')) {
          res.set('Content-Type', 'text/plain');
        }
        next();
      });

      return middlewares;
    },
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Disable sourcemaps for production if needed
      // if (env === 'production') {
      //   webpackConfig.devtool = false;
      // }

      // Add a rule to ignore source map warnings from node_modules
      webpackConfig.module.rules.push({
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules/,
      });
      // Temporarily ignore all source map warnings
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];

      return webpackConfig;
    },
  },
};
