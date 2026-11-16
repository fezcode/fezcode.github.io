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
    // These use Node's built-in runner (node:test); run them with `npm run test:scripts`.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'scripts/lib/log-artwork.test.cjs',
      'scripts/lib/steam-artwork.test.mjs',
    ],
  },
};
