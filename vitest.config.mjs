import react from '@vitejs/plugin-react';

export default {
  plugins: [react({ include: /\.(js|jsx|mjs|ts|tsx)$/ })],
  esbuild: {
    loader: 'jsx',
    include: [/src\/.*\.jsx?$/],
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
  },
};
