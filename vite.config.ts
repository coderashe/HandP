import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  base: '/HAndPShoes/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'dev-root-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '/index.html') {
            res.writeHead(302, { Location: '/HAndPShoes/' });
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],
  resolve: { alias: { '@': import.meta.dirname } },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
}));
