/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore
import storageHandler from './api/storage.js';
// @ts-ignore
import publishHandler from './api/publish.js';

// Helper to wrap Node res object to mimic Express/Next.js response
const wrapResponse = (res: any) => {
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return res;
  };
  res.send = (data: any) => {
    res.end(data);
    return res;
  };
  return res;
};

// Middleware for API
const apiMiddleware = () => ({
  name: 'api-middleware',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url?.startsWith('/api/')) {
        // Body parsing for POST requests
        if (req.method === 'POST' && !req.body) {
           const buffers = [];
           for await (const chunk of req) {
             buffers.push(chunk);
           }
           const data = Buffer.concat(buffers).toString();
           try {
             req.body = JSON.parse(data);
           } catch (e) {
             req.body = {};
           }
        }

        wrapResponse(res);

        try {
          if (req.url.split('?')[0] === '/api/storage') {
            await storageHandler(req, res);
            return;
          }
          if (req.url.split('?')[0] === '/api/publish') {
            await publishHandler(req, res);
            return;
          }
        } catch (error) {
          console.error('API Middleware Error:', error);
          if (!res.writableEnded) {
            res.status(500).json({ error: 'Internal Server Error' });
          }
        }
      }
      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiMiddleware()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
});
