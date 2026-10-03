import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'zip-download-header',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && req.url.includes('.zip')) {
              res.setHeader('Content-Disposition', 'attachment; filename="campusflow_code.zip"');
              res.setHeader('Content-Type', 'application/zip');
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // Two HTML entries: "/" (Asme landing) and "/campus/" (CampusFlow app).
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          campus: path.resolve(__dirname, 'campus/index.html'),
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
