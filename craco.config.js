module.exports = {
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    // Ensure devServerConfig.setupMiddlewares is a function
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      // No custom middlewares are added here, but the function must exist
      return middlewares;
    };

    // Remove deprecated properties if they exist to avoid warnings
    delete devServerConfig.onBeforeSetupMiddleware;
    delete devServerConfig.onAfterSetupMiddleware;

    return devServerConfig;
  },
};