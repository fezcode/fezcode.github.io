module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.ipify.org',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
};