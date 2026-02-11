/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore
import expressApp from './server/app.js';

// Middleware to integrate Express with Vite
const expressMiddleware = () => ({
  name: 'express-middleware',
  configureServer(server: any) {
    // Mount Express app
    // Note: Express handles its own routing, so we just pass requests to it.
    // However, Vite handles /api requests if we mount it.
    server.middlewares.use(expressApp);
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    expressMiddleware()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
});
