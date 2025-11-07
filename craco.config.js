module.exports = {
  devServer: {
    proxy: {
      '/api/show-my-ip': {
        target: 'https://api.ipify.org',
        changeOrigin: true,
        pathRewrite: { '^/api/show-my-ip': '' },
      },
    },
  },
  // webpack: {
  //   configure: (webpackConfig, { env, paths }) => {
  //     if (env === 'production') {
  //       webpackConfig.devtool = false; // Disable sourcemaps
  //     }
  //     return webpackConfig;
  //   },
  // },
};
