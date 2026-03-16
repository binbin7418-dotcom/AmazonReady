import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy, options) => {
          // Fallback: if no backend server, return error
          proxy.on('error', (err, req, res) => {
            console.log('API proxy error - backend not running');
          });
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
