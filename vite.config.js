import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    target: 'es2015',
  },
  server: {
    port: 3000,
    proxy: {
      '/api/show-my-ip': {
        target: 'https://api.ipify.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/show-my-ip/, ''),
      },
    },
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
});
