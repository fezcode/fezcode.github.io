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
};