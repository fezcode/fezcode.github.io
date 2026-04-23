import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';

const pimlContentType = () => ({
  name: 'piml-content-type',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.endsWith('.piml')) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      }
      next();
    });
  },
});

export default {
  plugins: [
    react({ include: /\.(js|jsx|mjs|ts|tsx)$/ }),
    vike(),
    pimlContentType(),
  ],
  esbuild: {
    loader: 'jsx',
    include: [/src\/.*\.jsx?$/, /pages\/.*\.jsx?$/, /renderer\/.*\.jsx?$/],
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  server: {
    port: 5190,
    host: '127.0.0.1',
    strictPort: false,
  },
  preview: {
    port: 4200,
    host: '127.0.0.1',
    strictPort: false,
  },
};
