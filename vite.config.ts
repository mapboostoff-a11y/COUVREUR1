/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    command === 'serve' ? {
      name: 'express-middleware',
      async configureServer(server: any) {
        // @ts-ignore
        const { default: expressApp } = await import('./server/app.js');
        server.middlewares.use(expressApp);
      },
    } : []
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
}));
